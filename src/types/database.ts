export type Category = 'work' | 'perso' | 'sante' | 'projet' | 'autre'
export type Priority = 'high' | 'medium' | 'low'
export type Status   = 'pending' | 'in_progress' | 'done'

export interface Task {
  id:           string
  user_id:      string
  title:        string
  description:  string | null
  category:     Category
  priority:     Priority
  status:       Status
  scheduled_at: string | null
  completed_at: string | null
  created_at:   string
  updated_at:   string
}

export type TaskInsert = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>
export type TaskUpdate = Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row:    Task
        Insert: TaskInsert & { user_id: string }
        Update: TaskUpdate
      }
    }
  }
}
