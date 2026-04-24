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
    currentStop: Stop | null;
    setCurrentStop: (stop: Stop) => void;

    // game history
    history: GameRecord[];
    steps: number;
    setHistory: (history: GameRecord[]) => void;
    setSteps: (steps: number) => void;

    // current line and direction
    selectedLine: string | null;
    selectedDirection: number | null;
    lineStops: Stop[];
    setSelectedLine: (line: string | null) => void;
    setSelectedDirection: (dir: number | null) => void;
    setLineStops: (stops: Stop[]) => void;

    // eshot lines (duraktan gecen)
    availableLines: { hat_no: string }[];
    setAvailableLines: (lines: { hat_no: string }[]) => void;

    // nearby stops
    nearbyStops: Stop[];
    setNearbyStops: (stops: Stop[]) => void;

    // Slider
    sliderIndex: number;
    setSliderIndex: (index: number) => void;

    // sidebar
    isSidebarOpen: boolean;
    setIsSidebarOpen: (val: boolean) => void;

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
    currentStop: null,
    history: [],
    steps: 0,
    selectedLine: null,
    selectedDirection: null,
    lineStops: [],
    sliderIndex: 0,
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
    setSliderIndex: (index) => set(() => ({sliderIndex: index})),
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

