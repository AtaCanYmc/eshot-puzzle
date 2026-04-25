import {create} from 'zustand';
import type {Stop} from '../types/supabaseTypes';
import React from "react";

interface GameRecord {
    stop: Stop;
    line?: string;
    direction?: number;
}

interface GameState {
    // current stop
    currentStop: Stop;
    setCurrentStop: (stop: Stop) => void;

    // target stop
    targetStop: Stop;
    setTargetStop: (stop: Stop) => void;

    // game history
    history: GameRecord[];
    steps: number;
    setHistory: (history: GameRecord[]) => void;
    setSteps: (steps: number) => void;

    // current line and direction
    selectedLine: string | null;
    selectedDirection: number | null;
    setSelectedLine: (line: string | null) => void;
    setSelectedDirection: (dir: number | null) => void;

    // haritada gözükecek duraklar
    availableStops: Stop[];
    setAvailableStops: (stops: Stop[]) => void;

    // eshot lines (duraktan gecen)
    availableLines: string[];
    setAvailableLines: (lines: string[]) => void;

    // nearby stops
    nearbyStops: Stop[];
    setNearbyStops: (stops: Stop[]) => void;

    // Slider
    sliderIndex: number;
    setSliderIndex: (index: number) => void;

    //sidebar content
    sidebarContent: React.ReactNode;
    setSidebarContent: (content: React.ReactNode) => void;

    // sidebar
    isSidebarOpen: boolean;
    setIsSidebarOpen: (val: boolean) => void;
    toggleSidebar: () => void;

    // loading
    loading: boolean;
    loadingIcon: React.ReactNode;
    loadingMessage: string;
    setLoading: (val: boolean) => void;
    setLoadingIcon: (icon: React.ReactNode) => void;
    setLoadingMessage: (message: string) => void;

    // reset
    reset: (firstStop: Stop) => void;
}

export const useGameStore = create<GameState>((set) => ({
    currentStop: {} as Stop,
    targetStop: {} as Stop,
    history: [],
    steps: 0,
    selectedLine: null,
    selectedDirection: null,
    sliderIndex: 0,
    sidebarContent: null,
    availableLines: [],
    loading: false,
    loadingIcon: null,
    loadingMessage: '',
    isSidebarOpen: true,
    nearbyStops: [],
    availableStops: [],
    setCurrentStop: (stop) => set(() => ({currentStop: stop})),
    setTargetStop: (stop) => set(() => ({targetStop: stop})),
    setHistory: (history) => set(() => ({history})),
    setSteps: (steps) => set(() => ({steps})),
    setSelectedLine: (line) => set(() => ({selectedLine: line})),
    setSelectedDirection: (dir) => set(() => ({selectedDirection: dir})),
    setSliderIndex: (index) => set(() => ({sliderIndex: index})),
    setAvailableLines: (lines) => set(() => ({availableLines: lines})),
    setLoading: (val) => set(() => ({loading: val})),
    setLoadingIcon: (icon) => set(() => ({loadingIcon: icon})),
    setLoadingMessage: (message) => set(() => ({loadingMessage: message})),
    setIsSidebarOpen: (val) => set(() => ({isSidebarOpen: val})),
    toggleSidebar: () => set((state) => ({isSidebarOpen: !state.isSidebarOpen})),
    setNearbyStops: (stops) => set(() => ({nearbyStops: stops})),
    setAvailableStops: (stops) => set(() => ({availableStops: stops})),
    setSidebarContent: (content) => set(() => ({sidebarContent: content})),
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

