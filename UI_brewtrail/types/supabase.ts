export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      app_users: {
        Row: {
          auth_uid: string | null;
          created_at: string;
          email: string | null;
          id: number;
          name: string | null;
          password_hash: string | null;
          updated_at: string;
        };
        Insert: {
          auth_uid?: string | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          name?: string | null;
          password_hash?: string | null;
          updated_at?: string;
        };
        Update: {
          auth_uid?: string | null;
          created_at?: string;
          email?: string | null;
          id?: number;
          name?: string | null;
          password_hash?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      brewery: {
        Row: {
          brewery_type: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          id: number;
          latitude: string | null;
          longitude: string | null;
          name: string | null;
          open_brewery_db_id: string | null;
          phone: string | null;
          postal_code: string | null;
          state_province: string | null;
          street: string | null;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          brewery_type?: string | null;
          city?: string | null;
          country?: string | null;
          created_at: string;
          id?: number;
          latitude?: string | null;
          longitude?: string | null;
          name?: string | null;
          open_brewery_db_id?: string | null;
          phone?: string | null;
          postal_code?: string | null;
          state_province?: string | null;
          street?: string | null;
          updated_at: string;
          website_url?: string | null;
        };
        Update: {
          brewery_type?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          id?: number;
          latitude?: string | null;
          longitude?: string | null;
          name?: string | null;
          open_brewery_db_id?: string | null;
          phone?: string | null;
          postal_code?: string | null;
          state_province?: string | null;
          street?: string | null;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [];
      };
      friendships: {
        Row: {
          addressee_id: number | null;
          created_at: string;
          id: number;
          requester_id: number | null;
          status: string | null;
          updated_at: string;
        };
        Insert: {
          addressee_id?: number | null;
          created_at: string;
          id?: number;
          requester_id?: number | null;
          status?: string | null;
          updated_at: string;
        };
        Update: {
          addressee_id?: number | null;
          created_at?: string;
          id?: number;
          requester_id?: number | null;
          status?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fkf80samhnxk57grq9ul76tfsj9';
            columns: ['requester_id'];
            isOneToOne: false;
            referencedRelation: 'app_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fkokkwkpy8rdu7h6x1kk0grerga';
            columns: ['addressee_id'];
            isOneToOne: false;
            referencedRelation: 'app_users';
            referencedColumns: ['id'];
          },
        ];
      };
      review: {
        Row: {
          brewery_id: number | null;
          comment: string | null;
          created_at: string;
          id: number;
          rating: number;
          updated_at: string;
          user_id: number | null;
        };
        Insert: {
          brewery_id?: number | null;
          comment?: string | null;
          created_at: string;
          id?: number;
          rating: number;
          updated_at: string;
          user_id?: number | null;
        };
        Update: {
          brewery_id?: number | null;
          comment?: string | null;
          created_at?: string;
          id?: number;
          rating?: number;
          updated_at?: string;
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk5q9o6h7up768022km75k4kuwa';
            columns: ['brewery_id'];
            isOneToOne: false;
            referencedRelation: 'brewery';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fktgl4ofjb2rqpwp8flqpfoqn0i';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'app_users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
