export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      events: {
        Row: {
          cover_image_url: string | null
          created_at: string
          created_by: string
          description: string | null
          end_datetime: string
          host_name: string | null
          id: string
          location_address: string | null
          location_map_url: string | null
          location_name: string | null
          password: string | null
          privacy: Database["public"]["Enums"]["event_privacy"]
          slug: string
          start_datetime: string
          status: Database["public"]["Enums"]["event_status"]
          theme_template_id: string | null
          timezone: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          end_datetime: string
          host_name?: string | null
          id?: string
          location_address?: string | null
          location_map_url?: string | null
          location_name?: string | null
          password?: string | null
          privacy?: Database["public"]["Enums"]["event_privacy"]
          slug: string
          start_datetime: string
          status?: Database["public"]["Enums"]["event_status"]
          theme_template_id?: string | null
          timezone?: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_datetime?: string
          host_name?: string | null
          id?: string
          location_address?: string | null
          location_map_url?: string | null
          location_name?: string | null
          password?: string | null
          privacy?: Database["public"]["Enums"]["event_privacy"]
          slug?: string
          start_datetime?: string
          status?: Database["public"]["Enums"]["event_status"]
          theme_template_id?: string | null
          timezone?: string
          title?: string
          type?: Database["public"]["Enums"]["event_type"]
          updated_at?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string
          email: string | null
          event_id: string
          id: string
          invited_status: Database["public"]["Enums"]["invited_status"]
          name: string
          phone: string | null
          rsvp_status: Database["public"]["Enums"]["rsvp_status"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          event_id: string
          id?: string
          invited_status?: Database["public"]["Enums"]["invited_status"]
          name: string
          phone?: string | null
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"]
        }
        Update: {
          created_at?: string
          email?: string | null
          event_id?: string
          id?: string
          invited_status?: Database["public"]["Enums"]["invited_status"]
          name?: string
          phone?: string | null
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"]
        }
        Relationships: [
          {
            foreignKeyName: "guests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string | null
          channel: Database["public"]["Enums"]["message_channel"]
          created_at: string
          event_id: string
          id: string
          recipient: string
          sent_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          body?: string | null
          channel?: Database["public"]["Enums"]["message_channel"]
          created_at?: string
          event_id: string
          id?: string
          recipient: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          body?: string | null
          channel?: Database["public"]["Enums"]["message_channel"]
          created_at?: string
          event_id?: string
          id?: string
          recipient?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_media: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          media_type: string
          media_url: string
          portal: string
          sort_order: number
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          media_type: string
          media_url: string
          portal: string
          sort_order?: number
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          media_type?: string
          media_url?: string
          portal?: string
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          attendee_email: string
          attendee_name: string
          checkin_status: Database["public"]["Enums"]["checkin_status"]
          created_at: string
          event_id: string
          id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          qr_code_value: string
          ticket_id: string | null
          total_paid: number
          user_id: string | null
        }
        Insert: {
          attendee_email: string
          attendee_name: string
          checkin_status?: Database["public"]["Enums"]["checkin_status"]
          created_at?: string
          event_id: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          qr_code_value?: string
          ticket_id?: string | null
          total_paid?: number
          user_id?: string | null
        }
        Update: {
          attendee_email?: string
          attendee_name?: string
          checkin_status?: Database["public"]["Enums"]["checkin_status"]
          created_at?: string
          event_id?: string
          id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          qr_code_value?: string
          ticket_id?: string | null
          total_paid?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps: {
        Row: {
          created_at: string
          event_id: string
          guest_email: string
          guest_name: string
          id: string
          meal_preference: string | null
          notes: string | null
          plus_one_name: string | null
          response: Database["public"]["Enums"]["rsvp_response"]
        }
        Insert: {
          created_at?: string
          event_id: string
          guest_email: string
          guest_name: string
          id?: string
          meal_preference?: string | null
          notes?: string | null
          plus_one_name?: string | null
          response?: Database["public"]["Enums"]["rsvp_response"]
        }
        Update: {
          created_at?: string
          event_id?: string
          guest_email?: string
          guest_name?: string
          id?: string
          meal_preference?: string | null
          notes?: string | null
          plus_one_name?: string | null
          response?: Database["public"]["Enums"]["rsvp_response"]
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          description: string | null
          end_time: string
          event_id: string
          id: string
          speaker_name: string | null
          start_time: string
          title: string
          track_name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time: string
          event_id: string
          id?: string
          speaker_name?: string | null
          start_time: string
          title: string
          track_name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string
          event_id?: string
          id?: string
          speaker_name?: string | null
          start_time?: string
          title?: string
          track_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          created_at: string
          event_id: string
          id: string
          logo_url: string | null
          name: string
          tier: Database["public"]["Enums"]["sponsor_tier"]
          website_url: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          logo_url?: string | null
          name: string
          tier?: Database["public"]["Enums"]["sponsor_tier"]
          website_url?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          logo_url?: string | null
          name?: string
          tier?: Database["public"]["Enums"]["sponsor_tier"]
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          event_id: string
          id: string
          is_active: boolean
          name: string
          price: number
          quantity: number
          sales_end: string | null
          sales_start: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          is_active?: boolean
          name: string
          price?: number
          quantity?: number
          sales_end?: string | null
          sales_start?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          quantity?: number
          sales_end?: string | null
          sales_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      verify_event_password: {
        Args: { _event_id: string; _password: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "organizer"
        | "host"
        | "staff"
        | "sponsor"
        | "speaker"
        | "attendee"
      checkin_status: "not_checked_in" | "checked_in"
      event_privacy: "public" | "link_only" | "password"
      event_status: "draft" | "published" | "ended"
      event_type: "professional" | "social"
      invited_status: "not_sent" | "sent"
      message_channel: "email" | "sms"
      payment_status: "unpaid" | "paid" | "refunded"
      rsvp_response: "yes" | "no" | "maybe"
      rsvp_status: "no_response" | "yes" | "no" | "maybe"
      sponsor_tier: "platinum" | "gold" | "silver"
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
    Enums: {
      app_role: [
        "super_admin",
        "organizer",
        "host",
        "staff",
        "sponsor",
        "speaker",
        "attendee",
      ],
      checkin_status: ["not_checked_in", "checked_in"],
      event_privacy: ["public", "link_only", "password"],
      event_status: ["draft", "published", "ended"],
      event_type: ["professional", "social"],
      invited_status: ["not_sent", "sent"],
      message_channel: ["email", "sms"],
      payment_status: ["unpaid", "paid", "refunded"],
      rsvp_response: ["yes", "no", "maybe"],
      rsvp_status: ["no_response", "yes", "no", "maybe"],
      sponsor_tier: ["platinum", "gold", "silver"],
    },
  },
} as const
