export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_automations: {
        Row: {
          automation_type: string
          client_id: string | null
          created_at: string | null
          executed_at: string | null
          id: string
          notes: string | null
          result: string | null
          trigger_data: Json | null
          user_id: string
        }
        Insert: {
          automation_type: string
          client_id?: string | null
          created_at?: string | null
          executed_at?: string | null
          id?: string
          notes?: string | null
          result?: string | null
          trigger_data?: Json | null
          user_id: string
        }
        Update: {
          automation_type?: string
          client_id?: string | null
          created_at?: string | null
          executed_at?: string | null
          id?: string
          notes?: string | null
          result?: string | null
          trigger_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_automations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_automations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_cancellations: {
        Row: {
          appointment_id: string | null
          cancellation_reason: string | null
          created_at: string | null
          id: string
          refund_amount: number | null
          refund_date: string | null
          user_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          id?: string
          refund_amount?: number | null
          refund_date?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          id?: string
          refund_amount?: number | null
          refund_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_cancellations_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_cancellations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          ai_created: boolean | null
          client_id: string
          created_at: string | null
          duration_minutes: number
          id: string
          notes: string | null
          price: number
          scheduled_date: string
          scheduled_time: string
          service_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_created?: boolean | null
          client_id: string
          created_at?: string | null
          duration_minutes: number
          id?: string
          notes?: string | null
          price: number
          scheduled_date: string
          scheduled_time: string
          service_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_created?: boolean | null
          client_id?: string
          created_at?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          price?: number
          scheduled_date?: string
          scheduled_time?: string
          service_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_logs: {
        Row: {
          appointment_id: string | null
          client_id: string | null
          id: string
          message: string | null
          payment_id: string | null
          sent_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          appointment_id?: string | null
          client_id?: string | null
          id?: string
          message?: string | null
          payment_id?: string | null
          sent_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          appointment_id?: string | null
          client_id?: string | null
          id?: string
          message?: string | null
          payment_id?: string | null
          sent_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_logs_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          cpf: string | null
          created_at: string | null
          email: string | null
          first_visit: string | null
          id: string
          is_active: boolean | null
          last_visit: string | null
          name: string | null
          notes: string | null
          phone: string
          total_spent: number | null
          updated_at: string | null
          user_id: string
          visit_count: number | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          first_visit?: string | null
          id?: string
          is_active?: boolean | null
          last_visit?: string | null
          name?: string | null
          notes?: string | null
          phone: string
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
          visit_count?: number | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          first_visit?: string | null
          id?: string
          is_active?: boolean | null
          last_visit?: string | null
          name?: string | null
          notes?: string | null
          phone?: string
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
          visit_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_metrics: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          metric_date: string
          metric_type: string
          metric_value: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_date: string
          metric_type: string
          metric_value: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_type?: string
          metric_value?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversion_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string
          client_id: string
          created_at: string | null
          due_date: string | null
          id: string
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          appointment_id: string
          client_id: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          appointment_id?: string
          client_id?: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          billing_cycle: string
          created_at: string | null
          features: Json
          id: string
          is_active: boolean | null
          name: string
          price: number
          price_id: string
          total_annual: number | null
        }
        Insert: {
          billing_cycle: string
          created_at?: string | null
          features: Json
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          price_id: string
          total_annual?: number | null
        }
        Update: {
          billing_cycle?: string
          created_at?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          price_id?: string
          total_annual?: number | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string | null
          color: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          return_period_days: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          return_period_days?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          return_period_days?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_client_mapping: {
        Row: {
          client_reference_id: string
          created_at: string | null
          id: string
          subscription_id: string
        }
        Insert: {
          client_reference_id: string
          created_at?: string | null
          id?: string
          subscription_id: string
        }
        Update: {
          client_reference_id?: string
          created_at?: string | null
          id?: string
          subscription_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          ai_agent_name: string | null
          ai_collection_prompt: string | null
          ai_main_prompt: string | null
          ai_retention_prompt: string | null
          business_hours: Json | null
          created_at: string | null
          deleted_at: string | null
          email: string
          id: string
          phone: string | null
          profile_photo_url: string | null
          salon_name: string
          stripe_current_period_end: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          updated_at: string | null
          user_name: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          ai_agent_name?: string | null
          ai_collection_prompt?: string | null
          ai_main_prompt?: string | null
          ai_retention_prompt?: string | null
          business_hours?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          id?: string
          phone?: string | null
          profile_photo_url?: string | null
          salon_name: string
          stripe_current_period_end?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_name?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          ai_agent_name?: string | null
          ai_collection_prompt?: string | null
          ai_main_prompt?: string | null
          ai_retention_prompt?: string | null
          business_hours?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          id?: string
          phone?: string | null
          profile_photo_url?: string | null
          salon_name?: string
          stripe_current_period_end?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_name?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          client_id: string | null
          content: string
          created_at: string | null
          id: string
          is_from_ai: boolean | null
          message_id: string | null
          message_type: string
          phone: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_from_ai?: boolean | null
          message_id?: string | null
          message_type: string
          phone: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_from_ai?: boolean | null
          message_id?: string | null
          message_type?: string
          phone?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_available_slots: {
        Args: { p_user_id: string; p_date: string; p_duration?: number }
        Returns: {
          time_slot: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
