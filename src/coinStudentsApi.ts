import { supabase } from "./supabaseClient";

export type CoinStudent = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  direction: string;
  coins: number;
  level: string;
  progress: number;
  joinedAt: string;
};

type CoinStudentRow = {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  phone: string;
  direction: string;
  coins: number;
  level: string;
  progress: number;
  joined_at: string;
};

function ensureSupabase() {
  if (!supabase) {
    throw new Error("Supabase sozlanmagan.");
  }

  return supabase;
}

function fromRow(row: CoinStudentRow): CoinStudent {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    age: row.age,
    phone: row.phone,
    direction: row.direction,
    coins: row.coins,
    level: row.level,
    progress: row.progress,
    joinedAt: row.joined_at,
  };
}

function toRow(student: CoinStudent): CoinStudentRow {
  return {
    id: student.id,
    first_name: student.firstName,
    last_name: student.lastName,
    age: student.age,
    phone: student.phone,
    direction: student.direction,
    coins: student.coins,
    level: student.level,
    progress: student.progress,
    joined_at: student.joinedAt,
  };
}

export async function fetchCoinStudents() {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("coin_students")
    .select("*")
    .order("coins", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => fromRow(row as CoinStudentRow));
}

export async function insertCoinStudent(student: CoinStudent) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("coin_students")
    .insert(toRow(student))
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return fromRow(data as CoinStudentRow);
}

export async function updateCoinStudent(student: CoinStudent) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("coin_students")
    .update(toRow(student))
    .eq("id", student.id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return fromRow(data as CoinStudentRow);
}

export async function deleteCoinStudent(studentId: string) {
  const client = ensureSupabase();
  const { error } = await client
    .from("coin_students")
    .delete()
    .eq("id", studentId);

  if (error) {
    throw error;
  }
}

