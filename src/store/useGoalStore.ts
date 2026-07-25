import { create } from 'zustand'
import { Goal, GoalType } from '../types'
import { goalsApi } from '../services/api'

interface GoalStore {
  goals: Goal[]
  isLoading: boolean
  fetchGoals: () => Promise<void>
  createGoal: (data: {
    title: string
    type: GoalType
    target_hours: number
    deadline?: string
  }) => Promise<void>
  updateGoal: (id: number, data: Partial<Goal>) => Promise<void>
  deleteGoal: (id: number) => Promise<void>
  completeGoal: (id: number) => Promise<void>
  // Derived
  totalTargetHoursToday: number
  totalCurrentHoursToday: number
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [],
  isLoading: false,
  totalTargetHoursToday: 0,
  totalCurrentHoursToday: 0,

  fetchGoals: async () => {
    set({ isLoading: true })
    try {
      const res = await goalsApi.list()
      const goals: Goal[] = res.data
      set({
        goals,
        totalTargetHoursToday: goals
          .filter((g) => !g.completed)
          .reduce((sum, g) => sum + g.target_hours, 0),
        totalCurrentHoursToday: goals
          .filter((g) => !g.completed)
          .reduce((sum, g) => sum + g.current_hours, 0),
      })
    } catch (err) {
      console.error('Failed to fetch goals:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  createGoal: async (data) => {
    try {
      const res = await goalsApi.create(data)
      set((state) => ({
        goals: [res.data, ...state.goals],
      }))
      get().fetchGoals()
    } catch (err) {
      console.error('Failed to create goal:', err)
    }
  },

  updateGoal: async (id, data) => {
    try {
      const res = await goalsApi.update(id, data)
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? res.data : g)),
      }))
    } catch (err) {
      console.error('Failed to update goal:', err)
    }
  },

  deleteGoal: async (id) => {
    try {
      await goalsApi.delete(id)
      set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }))
    } catch (err) {
      console.error('Failed to delete goal:', err)
    }
  },

  completeGoal: async (id) => {
    try {
      const res = await goalsApi.complete(id)
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? res.data : g)),
      }))
    } catch (err) {
      console.error('Failed to complete goal:', err)
    }
  },
}))
