import {create} from 'zustand';
import type {Stop} from '../types/supabaseTypes';
import React from "react";

interface GameRecord {
    stop: Stop;
    line?: string;
    direction?: number;
}

interface GameState {
    // values
    currentStop: Stop | null;
    history: GameRecord[];
    steps: number;
    selectedLine: string | null;
    selectedDirection: number | null;
    lineStops: Stop[];
    isWalking: boolean;
    availableLines: { hat_no: string }[];
    loading: boolean;
    loadingIcon: React.ReactNode;
    loadingMessage: string;
    isSidebarOpen: boolean;
    nearbyStops: Stop[];
    // Setters
    setCurrentStop: (stop: Stop) => void;
    setHistory: (history: GameRecord[]) => void;
    setSteps: (steps: number) => void;
    setSelectedLine: (line: string | null) => void;
    setSelectedDirection: (dir: number | null) => void;
    setLineStops: (stops: Stop[]) => void;
    setIsWalking: (val: boolean) => void;
    setAvailableLines: (lines: { hat_no: string }[]) => void;
    setLoading: (val: boolean) => void;
    setLoadingIcon: (icon: React.ReactNode) => void;
    setLoadingMessage: (message: string) => void;
    setIsSidebarOpen: (val: boolean) => void;
    setNearbyStops: (stops: Stop[]) => void;
    reset: (firstStop: Stop) => void;
}

export const useGameStore = create<GameState>((set) => ({
    currentStop: null,
    history: [],
    steps: 0,
    selectedLine: null,
    selectedDirection: null,
    lineStops: [],
    isWalking: false,
    availableLines: [],
    loading: false,
    loadingIcon: null,
    loadingMessage: '',
    isSidebarOpen: true,
    nearbyStops: [],
    setCurrentStop: (stop) => set(() => ({currentStop: stop})),
    setHistory: (history) => set(() => ({history})),
    setSteps: (steps) => set(() => ({steps})),
    setSelectedLine: (line) => set(() => ({selectedLine: line})),
    setSelectedDirection: (dir) => set(() => ({selectedDirection: dir})),
    setLineStops: (stops) => set(() => ({lineStops: stops})),
    setIsWalking: (val) => set(() => ({isWalking: val})),
    setAvailableLines: (lines) => set(() => ({availableLines: lines})),
    setLoading: (val) => set(() => ({loading: val})),
    setLoadingIcon: (icon) => set(() => ({loadingIcon: icon})),
    setLoadingMessage: (message) => set(() => ({loadingMessage: message})),
    setIsSidebarOpen: (val) => set(() => ({isSidebarOpen: val})),
    setNearbyStops: (stops) => set(() => ({nearbyStops: stops})),
    reset: (firstStop) => set(() => ({
        currentStop: firstStop,
        history: [{stop: firstStop}],
        steps: 0,
        selectedLine: null,
        selectedDirection: null,
        lineStops: [],
        isWalking: false,
        availableLines: [],
        loading: false,
        isSidebarOpen: true,
        nearbyStops: [],
    })),
}));

