import type { Memory, Provider, State } from "@ai16z/eliza";
import type { AgentRuntime as IAgentRuntime } from "@ai16z/eliza";
import fetch from 'node-fetch';

interface OperatorData {
    address: string;
    metadataName?: string;
    metadataDescription?: string;
    metadataWebsite?: string;
    totalStakers: number;
    totalAvs: number;
    apy: string;
    shares: Array<{
        strategyAddress: string;
        shares: string;
    }>;
    avsRegistrations: Array<{
        avsAddress: string;
        isActive: boolean;
    }>;
}

interface StakersListResponse {
    data: Array<{
        address: string;
        operatorAddress: string;
    }>;
    meta: {
        total: number;
    };
}

interface TvlData {
    tvl: number;
}

const API_BASE_URL = 'https://api-holesky.eigenexplorer.com';

async function fetchTvlData(): Promise<TvlData | null> {
    try {
        console.log('Fetching TVL data...');
        const response = await fetch(`${API_BASE_URL}/metrics/tvl`);
        if (!response.ok) {
            console.log('TVL fetch failed:', response.status);
            return null;
        }
        const data = await response.json();
        console.log('TVL data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching TVL data:', error);
        return null;
    }
}

async function fetchStakersList(): Promise<StakersListResponse | null> {
    try {
        console.log('Fetching stakers list...');
        const response = await fetch(`${API_BASE_URL}/stakers`);
        if (!response.ok) {
            console.log('Stakers list fetch failed:', response.status);
            return null;
        }
        const data = await response.json();
        console.log('Stakers list received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching stakers list:', error);
        return null;
    }
}

async function fetchOperatorData(operatorAddress: string): Promise<OperatorData | null> {
    try {
        console.log('Fetching operator data for:', operatorAddress);
        const response = await fetch(`${API_BASE_URL}/operators/${operatorAddress}`);
        if (!response.ok) {
            console.log('Operator data fetch failed:', response.status);
            return null;
        }
        const data = await response.json();
        console.log('Operator data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching operator data:', error);
        return null;
    }
}

function calculateTotalShares(shares: Array<{ shares: string }>): string {
    return shares.reduce((total, current) => {
        const currentShares = BigInt(current.shares);
        return (BigInt(total) + currentShares).toString();
    }, "0");
}

function formatBigNumber(value: string): string {
    const num = BigInt(value);
    return (Number(num) / 1e18).toFixed(2);
}

function extractAddresses(message: Memory): string[] {
    const addressRegex = /0x[a-fA-F0-9]{40}/g;
    const content = typeof message.content === 'object' && 'text' in message.content
        ? message.content.text
        : String(message.content);
    const addresses = content.match(addressRegex) || [];
    console.log('Extracted addresses:', addresses);
    return addresses;
}

const eigenexplorerProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        console.log('Eigenexplorer provider called with message:', message);
        const text = typeof message.content === 'object' && 'text' in message.content
            ? message.content.text.toLowerCase()
            : String(message.content).toLowerCase();
        console.log('Processed text:', text);

        // Handle TVL query
        if (text.includes('tvl')) {
            console.log('Processing TVL query');
            const tvlData = await fetchTvlData();
            if (tvlData) {
                const response = `Current EigenLayer TVL: $${tvlData.tvl.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
                console.log('Returning TVL response:', response);
                return response;
            }
            return "Unable to fetch TVL data at the moment.";
        }

        // Handle stakers list query
        if (text.includes('list stakers') || text.includes('show stakers')) {
            console.log('Processing stakers list query');
            const stakersData = await fetchStakersList();
            if (stakersData?.data.length) {
                const stakersList = stakersData.data.slice(0, 5)
                    .map(s => `${s.address} (delegated to ${s.operatorAddress})`)
                    .join('\n- ');
                const response = `Found ${stakersData.meta.total} stakers. Here are the first 5:\n- ${stakersList}`;
                console.log('Returning stakers list response:', response);
                return response;
            }
            return "No stakers found.";
        }

        // Handle operator status query
        const addresses = extractAddresses(message);
        if (addresses.length > 0) {
            console.log('Processing operator status query for:', addresses[0]);
            const operatorData = await fetchOperatorData(addresses[0]);
            if (operatorData) {
                const totalShares = formatBigNumber(calculateTotalShares(operatorData.shares));
                const response = `Operator ${operatorData.metadataName || addresses[0]}:\n` +
                       `${operatorData.metadataDescription ? `Description: ${operatorData.metadataDescription}\n` : ''}` +
                       `- Total Stakers: ${operatorData.totalStakers}\n` +
                       `- Total AVS: ${operatorData.totalAvs}\n` +
                       `- APY: ${operatorData.apy}%\n` +
                       `- Total Shares: ${totalShares} shares\n` +
                       `${operatorData.metadataWebsite ? `- Website: ${operatorData.metadataWebsite}\n` : ''}` +
                       `- Active AVS Services: ${operatorData.avsRegistrations.filter(avs => avs.isActive).length}`;
                console.log('Returning operator status response:', response);
                return response;
            }
            return `No data found for address ${addresses[0]}`;
        }

        const helpMessage = "I can help you with:\n" +
               "1. Check TVL by asking 'What's the TVL?'\n" +
               "2. List stakers by saying 'list stakers'\n" +
               "3. Check operator status by providing their address";
        console.log('Returning help message:', helpMessage);
        return helpMessage;
    },
};

export { eigenexplorerProvider };
