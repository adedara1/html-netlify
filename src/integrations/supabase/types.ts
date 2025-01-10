export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      payment_links: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          moneroo_token: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          moneroo_token?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          moneroo_token?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          customer_email: string | null
          customer_first_name: string | null
          customer_last_name: string | null
          customer_phone: string | null
          description: string | null
          id: string
          method: string | null
          moneroo_payout_id: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_phone?: string | null
          description?: string | null
          id?: string
          method?: string | null
          moneroo_payout_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_phone?: string | null
          description?: string | null
          id?: string
          method?: string | null
          moneroo_payout_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          long_description: string | null
          name: string
          payment_link_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          long_description?: string | null
          name: string
          payment_link_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          long_description?: string | null
          name?: string
          payment_link_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          product_fee_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_fee_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_fee_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      simple_pages: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          payment_link_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          payment_link_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          payment_link_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simple_pages_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          customer_contact: string | null
          customer_name: string | null
          id: string
          moneroo_reference: string | null
          payment_link_id: string | null
          processed: boolean | null
          product_id: string | null
          status: string | null
          type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_contact?: string | null
          customer_name?: string | null
          id?: string
          moneroo_reference?: string | null
          payment_link_id?: string | null
          processed?: boolean | null
          product_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_contact?: string | null
          customer_name?: string | null
          id?: string
          moneroo_reference?: string | null
          payment_link_id?: string | null
          processed?: boolean | null
          product_id?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_payment_link_id_fkey"
            columns: ["payment_link_id"]
            isOneToOne: false
            referencedRelation: "payment_links"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          available_balance: number | null
          balance: number | null
          created_at: string
          daily_sales: number | null
          daily_transactions: number | null
          monthly_sales: number | null
          monthly_transactions: number | null
          pending_requests: number | null
          previous_month_sales: number | null
          previous_month_transactions: number | null
          sales_growth: number | null
          sales_total: number | null
          total_products: number | null
          total_transactions: number | null
          updated_at: string
          user_id: string
          validated_requests: number | null
          visible_products: number | null
        }
        Insert: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string
          daily_sales?: number | null
          daily_transactions?: number | null
          monthly_sales?: number | null
          monthly_transactions?: number | null
          pending_requests?: number | null
          previous_month_sales?: number | null
          previous_month_transactions?: number | null
          sales_growth?: number | null
          sales_total?: number | null
          total_products?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_id: string
          validated_requests?: number | null
          visible_products?: number | null
        }
        Update: {
          available_balance?: number | null
          balance?: number | null
          created_at?: string
          daily_sales?: number | null
          daily_transactions?: number | null
          monthly_sales?: number | null
          monthly_transactions?: number | null
          pending_requests?: number | null
          previous_month_sales?: number | null
          previous_month_transactions?: number | null
          sales_growth?: number | null
          sales_total?: number | null
          total_products?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_id?: string
          validated_requests?: number | null
          visible_products?: number | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          available: number | null
          created_at: string
          pending: number | null
          updated_at: string
          user_id: string
          validated: number | null
        }
        Insert: {
          available?: number | null
          created_at?: string
          pending?: number | null
          updated_at?: string
          user_id: string
          validated?: number | null
        }
        Update: {
          available?: number | null
          created_at?: string
          pending?: number | null
          updated_at?: string
          user_id?: string
          validated?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
