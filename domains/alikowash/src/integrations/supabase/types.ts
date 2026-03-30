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
      contacts: {
        Row: {
          country: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string | null
          name: string
          organization: string | null
          phone: string | null
          service_interest: string | null
          source_page: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          name: string
          organization?: string | null
          phone?: string | null
          service_interest?: string | null
          source_page?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          name?: string
          organization?: string | null
          phone?: string | null
          service_interest?: string | null
          source_page?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number | null
          country: string | null
          created_at: string
          currency: string | null
          donor_name: string
          email: string
          id: string
          message: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          country?: string | null
          created_at?: string
          currency?: string | null
          donor_name: string
          email: string
          id?: string
          message?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          country?: string | null
          created_at?: string
          currency?: string | null
          donor_name?: string
          email?: string
          id?: string
          message?: string | null
          status?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          category: string | null
          created_at: string
          display_order: number | null
          id: string
          is_published: boolean | null
          logo_url: string | null
          org_full_name: string | null
          org_name: string
          role: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          org_full_name?: string | null
          org_name: string
          role?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          org_full_name?: string | null
          org_name?: string
          role?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          capacity_m3: string | null
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_published: boolean | null
          location: string | null
          partner_names: string[] | null
          photos: string[] | null
          summary: string | null
          system_type: string | null
          tags: string[] | null
          title: string
          updated_at: string
          year_gc: string | null
        }
        Insert: {
          capacity_m3?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          partner_names?: string[] | null
          photos?: string[] | null
          summary?: string | null
          system_type?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          year_gc?: string | null
        }
        Update: {
          capacity_m3?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          partner_names?: string[] | null
          photos?: string[] | null
          summary?: string | null
          system_type?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          year_gc?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      story_chapters: {
        Row: {
          captions: string[] | null
          created_at: string
          id: string
          is_published: boolean | null
          order_index: number | null
          photos: string[] | null
          project_name: string
          story_text: string | null
          tags: string[] | null
          updated_at: string
          year: string
        }
        Insert: {
          captions?: string[] | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          photos?: string[] | null
          project_name: string
          story_text?: string | null
          tags?: string[] | null
          updated_at?: string
          year: string
        }
        Update: {
          captions?: string[] | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          photos?: string[] | null
          project_name?: string
          story_text?: string | null
          tags?: string[] | null
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number | null
          id: string
          is_published: boolean | null
          name: string
          photo_url: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          name: string
          photo_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          name?: string
          photo_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
