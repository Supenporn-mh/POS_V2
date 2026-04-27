import { create } from 'zustand'

interface GlobalState {
    screenLoading: boolean
    setScreenLoading: (loading: boolean) => void
}

const useGlobalStore = create<GlobalState>((set) => ({
    screenLoading: false,
    setScreenLoading: (loading) => set({ screenLoading: loading }),
}))

const setScreenLoading = (loading: boolean) => useGlobalStore.setState({ screenLoading: loading })

export default Object.assign(useGlobalStore, { setScreenLoading })
