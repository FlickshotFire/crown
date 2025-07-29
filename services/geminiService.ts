
import { ChatMessage } from '../types';


// All Gemini functionality has been removed.
// These functions now return simple, randomized, hardcoded strings to keep the app functional without an API key.

const quests = [
    "A new threat emerges. Scout the nearby lands for signs of danger.",
    "The villagers report strange noises from the old quarry. Investigate it.",
    "A traveling merchant was robbed on the road. Track down the bandits.",
    "Our scouts have spotted a valuable resource node. Secure it for the kingdom.",
];

export const generateQuest = async () => {
    return Promise.resolve(quests[Math.floor(Math.random() * quests.length)]);
};

const combatIntros = ["The battle was fierce, a flurry of steel and cries.", "A brutal clash of armies, with dust and blood filling the air.", "Our forces met the enemy on the field, a true test of our might."];
const combatOutros = ["We must rebuild our forces and learn from this encounter.", "A lesson has been learned this day.", "The bards will sing of this day for ages to come."];

export const generateCombatReport = async (
    playerArmy: any,
    enemyArmy: any,
    outcome: 'Victory' | 'Defeat',
    loot: any
) => {
    const lootString = Object.entries(loot).map(([type, count]) => `${Math.floor(count as number)} ${type}`).join(', ');
    const intro = combatIntros[Math.floor(Math.random() * combatIntros.length)];
    const outro = combatOutros[Math.floor(Math.random() * combatOutros.length)];
    const reportText = `${intro} A decisive ${outcome} was achieved for our side. We plundered ${lootString || 'nothing of value'}. ${outro}`;
    return Promise.resolve(reportText);
};


const spySuccessNarratives = [
    "My Lord, our agent has returned from {targetName}. The garrison appears to be primarily composed of {armyString}. They seem ripe for the plunder.",
    "Success! Our spy slipped into {targetName} unnoticed. Their army consists of roughly {armyString}. Their defenses are weak.",
    "The intel is fresh from {targetName}, my Lord. We've counted {armyString}. Now is the time to strike!",
];
const spyFailureNarratives = [
    "Our spy was detected while trying to infiltrate {targetName}. We've learned nothing, and we've lost a valuable agent.",
    "The mission to {targetName} was a failure. Our agent was captured before they could gather any useful information.",
    "Bad news from {targetName}. Our spy was compromised and barely escaped with their life. The enemy is on alert.",
];

export const generateSpyReport = async (reportData: any) => {
    if (!reportData.wasSuccessful) {
        const template = spyFailureNarratives[Math.floor(Math.random() * spyFailureNarratives.length)];
        return Promise.resolve(template.replace('{targetName}', reportData.targetName));
    }

    const armyString = reportData.estimatedArmy ? Object.entries(reportData.estimatedArmy).map(([type, count]) => `${count} ${type}(s)`).join(', ') : 'an unknown number of troops';
    const template = spySuccessNarratives[Math.floor(Math.random() * spySuccessNarratives.length)];
    const narrative = template.replace('{targetName}', reportData.targetName).replace('{armyString}', armyString);

    return Promise.resolve(narrative);
};

// Mocked chat response to align with other mocked functions
const aiResponses = [
    "Indeed, My Lord. What is your command?",
    "A wise decision, Your Highness. It shall be done.",
    "Consider the matter handled, My Lord.",
    "As you wish. The realm will prosper under your guidance.",
    "I shall see to it immediately, Your Highness.",
    "My apologies, Your Highness. A fog of confusion clouds my thoughts. Please, ask again later."
];

export const generateChatResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    // Return a random, pre-written response to avoid API calls.
    return Promise.resolve(aiResponses[Math.floor(Math.random() * aiResponses.length)]);
};
