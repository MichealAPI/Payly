export interface Currency {
    name: string; // ISO 4217 code
    symbol: string;
    countryCode: string; // lowercase ISO country code or regional
    emoji: string; // flag emoji
    fullName?: string; // Human readable (e.g., United States Dollar)
}