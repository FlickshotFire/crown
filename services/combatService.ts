




import { TROOPS, TOOLS, COMMANDERS } from "../constants";
import { Army, TroopType, Commander, POIType } from "../types";

const getBasePower = (army: Army, type: 'attack' | 'defense', commander?: Commander) => {
    let power = 0;
    for (const troopType in army) {
        const troopInfo = TROOPS.find(t => t.id === troopType);
        if (troopInfo) {
            let baseStat = troopInfo.stats[type];
            // Apply commander bonus if applicable
            if (commander) {
                const bonusType = commander.bonus.type;
                
                const appliesToAttack = type === 'attack' && ((bonusType === 'attack_melee' && troopInfo.slot === 'melee') || (bonusType === 'attack_ranged' && troopInfo.slot === 'ranged'));
                const appliesToDefense = type === 'defense' && ((bonusType === 'defense_melee' && troopInfo.slot === 'melee') || (bonusType === 'defense_ranged' && troopInfo.slot === 'ranged'));

                if (appliesToAttack || appliesToDefense) {
                    baseStat *= (1 + commander.bonus.value / 100);
                }
            }
            power += (army[troopType as TroopType] || 0) * baseStat;
        }
    }
    return power;
};


const resolveEngagement = (
    attackerArmy: Army, 
    defenderArmy: Army,
    defenderBonuses: { wall: number; gate: number; moat: number },
    attackerCommander?: Commander
) => {
    
    const attackerPower = getBasePower(attackerArmy, 'attack', attackerCommander);
    const baseDefenderPower = getBasePower(defenderArmy, 'defense', undefined);
    
    // Apply defense bonuses as multipliers
    const finalDefenderPower = baseDefenderPower * (1 + defenderBonuses.wall / 100) * (1 + defenderBonuses.gate / 100) * (1 + defenderBonuses.moat / 100);

    if (attackerPower === 0 && finalDefenderPower === 0) {
        return { attackerLosses: {}, defenderLosses: {} };
    }

    const powerRatio = attackerPower / (finalDefenderPower || 1);
    
    const attackerLossPercent = Math.min(0.95, 0.5 / (powerRatio + 0.1));
    const defenderLossPercent = Math.min(1.0, 0.7 * powerRatio);

    const attackerLosses: Army = {};
    const defenderLosses: Army = {};

    for (const troopType in attackerArmy) {
        const type = troopType as TroopType;
        const count = attackerArmy[type] || 0;
        attackerLosses[type] = Math.floor(count * attackerLossPercent);
    }
    for (const troopType in defenderArmy) {
        const type = troopType as TroopType;
        const count = defenderArmy[type] || 0;
        defenderLosses[type] = Math.floor(count * defenderLossPercent);
    }
    
    return { attackerLosses, defenderLosses };
};

const subtractLosses = (initialArmy: Army, losses: Army) => {
    const finalArmy: Army = {};
    for (const troopType in initialArmy) {
        const type = troopType as TroopType;
        const initialCount = initialArmy[type] || 0;
        const lostCount = losses[type] || 0;
        const remaining = initialCount - lostCount;
        if (remaining > 0) {
            finalArmy[type] = remaining;
        }
    }
    return finalArmy;
};

const combineArmies = (army1: Army, army2: Army) => {
    const combined: Army = { ...army1 };
    for (const troopType in army2) {
        const type = troopType as TroopType;
        combined[type] = (combined[type] || 0) + (army2[type] || 0);
    }
    return combined;
};


export const resolveBattle = async (
    attackPlan: any,
    targetPOI: any,
    initialAttackerArmy: Army,
    initialAttackerTools: any
) => {
    let currentDefenderArmy: Army = { ...targetPOI.army };
    let totalAttackerLosses: Army = {};
    let totalDefenderLosses: Army = {};

    for (const wave of attackPlan) {
        // Stop if defender is wiped out
        if (Object.keys(currentDefenderArmy).length === 0) {
            break;
        }

        const waveAttackerArmy = combineArmies(
            combineArmies(
                combineArmies(wave.left.melee, wave.left.ranged),
                combineArmies(wave.front.melee, wave.front.ranged)
            ),
            combineArmies(wave.right.melee, wave.right.ranged)
        );

        // If wave is empty, skip to next
        if (Object.keys(waveAttackerArmy).length === 0) {
            continue;
        }

        // Apply tool effects to defender bonuses for this wave
        const currentWaveDefenderBonuses = { ...targetPOI.defenseBonuses };
        for (const toolType in wave.tools) {
            const tool = TOOLS.find(t => t.id === toolType);
            const count = wave.tools[toolType] || 0;
            if (tool && count > 0) {
                const bonusToReduce = tool.effect.reduces as 'wall' | 'gate' | 'moat'; // 'wall', 'gate', 'moat'
                const reduction = tool.effect.byPercent * count;
                currentWaveDefenderBonuses[bonusToReduce] = Math.max(0, currentWaveDefenderBonuses[bonusToReduce] - reduction);
            }
        }

        // Simple commander logic: find the first assigned commander in the wave and use them.
        const commanderId = wave.commanders.front || wave.commanders.left || wave.commanders.right;
        const commander = COMMANDERS.find(c => c.id === commanderId);

        // Resolve this wave's engagement
        const { attackerLosses: waveAttackerLosses, defenderLosses: waveDefenderLosses } = resolveEngagement(
            waveAttackerArmy,
            currentDefenderArmy,
            currentWaveDefenderBonuses,
            commander
        );

        // Accumulate losses
        totalAttackerLosses = combineArmies(totalAttackerLosses, waveAttackerLosses);
        totalDefenderLosses = combineArmies(totalDefenderLosses, waveDefenderLosses);

        // Update defender's army for the next wave
        currentDefenderArmy = subtractLosses(currentDefenderArmy, waveDefenderLosses);
    }
    
    // Calculate final states
    const isVictory = Object.keys(currentDefenderArmy).length === 0;

    const finalAttackerArmy = subtractLosses(initialAttackerArmy, totalAttackerLosses);
    
    // Subtract used tools from attacker's inventory
    const finalAttackerTools = { ...initialAttackerTools };
    attackPlan.forEach((wave: any) => {
        for (const toolType in wave.tools) {
            const type = toolType;
            finalAttackerTools[type] = (finalAttackerTools[type] || 0) - (wave.tools[type] || 0);
            if (finalAttackerTools[type] <= 0) {
                delete finalAttackerTools[type];
            }
        }
    });


    const finalDefenderPOI = {
        ...targetPOI,
        army: currentDefenderArmy,
    };
    
    // Calculate event gains for cultist towers
    let eventGains: { points: number, horns: number } | undefined = undefined;
    if (isVictory && targetPOI.type === POIType.CultistTower) {
        const points = Math.floor(targetPOI.level * 1.5 + 10);
        const horns = Math.floor(targetPOI.level * 0.5 + 2);
        eventGains = { points, horns };
    }

    // If the cultist tower is defeated, set its burnt state and cooldown
    if (isVictory && targetPOI.type === POIType.CultistTower) {
        finalDefenderPOI.isBurnt = true;
        finalDefenderPOI.respawnsAt = Date.now() + 3 * 60 * 60 * 1000; // 3 hour cooldown
    }

    // Calculate loot (e.g., 25% of the resource cost of defeated troops)
    const loot: { [key: string]: number } = {};
    for (const troopType in totalDefenderLosses) {
        const troopInfo = TROOPS.find(t => t.id === troopType);
        const count = totalDefenderLosses[troopType as TroopType] || 0;
        if (troopInfo) {
            for (const resourceType in troopInfo.cost) {
                const type = resourceType;
                const costPerUnit = troopInfo.cost[type as keyof typeof troopInfo.cost] || 0;
                loot[type] = (loot[type] || 0) + costPerUnit * count * 0.25; // 25% loot
            }
        }
    }
    
    const report = {
        isVictory,
        attackerLosses: totalAttackerLosses,
        defenderLosses: totalDefenderLosses,
        loot,
        eventGains,
    };

    return {
        report,
        finalAttackerArmy,
        finalAttackerTools,
        finalDefenderPOI,
    };
};