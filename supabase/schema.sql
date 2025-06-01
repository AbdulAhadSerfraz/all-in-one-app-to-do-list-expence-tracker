-- Create tables for HabitSync

-- Enable RLS (Row Level Security)
alter default privileges revoke execute on functions from public;

-- Create a table for public user profiles
create table public.users (
    id uuid references auth.users not null primary key,
    email text not null,
    name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users table
alter table public.users enable row level security;

-- Create policies for users table
create policy "Users can view their own profile"
    on users for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on users for update
    using (auth.uid() = id);

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, name, avatar_url)
    values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
    return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to automatically create a user profile on signup
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Expenses table
create table public.expenses (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    amount decimal(10,2) not null,
    description text not null,
    category text not null,
    date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,

    constraint amount_positive check (amount >= 0)
);

-- Sleep entries table
create table public.sleep_entries (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    quality integer not null,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,

    constraint quality_range check (quality between 1 and 5),
    constraint valid_sleep_time check (end_time > start_time)
);

-- Mood entries table
create table public.mood_entries (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    mood_level integer not null,
    energy_level integer not null,
    notes text,
    date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,

    constraint mood_level_range check (mood_level between 1 and 5),
    constraint energy_level_range check (energy_level between 1 and 5)
);

-- Calorie entries table
create table public.calorie_entries (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    calories integer not null,
    meal_type text not null,
    food_items text[] not null,
    date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,

    constraint calories_positive check (calories >= 0)
);

-- Journal entries table
create table public.journal_entries (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    content text not null,
    mood_tag text,
    date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Todo items table
create table public.todo_items (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    title text not null,
    description text,
    due_date timestamp with time zone,
    completed boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.expenses enable row level security;
alter table public.sleep_entries enable row level security;
alter table public.mood_entries enable row level security;
alter table public.calorie_entries enable row level security;
alter table public.journal_entries enable row level security;
alter table public.todo_items enable row level security;

-- Create policies
create policy "Users can view their own expenses"
    on expenses for select
    using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
    on expenses for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
    on expenses for update
    using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
    on expenses for delete
    using (auth.uid() = user_id);

-- Repeat similar policies for other tables
create policy "Users can view their own sleep entries"
    on sleep_entries for select
    using (auth.uid() = user_id);

create policy "Users can insert their own sleep entries"
    on sleep_entries for insert
    with check (auth.uid() = user_id);

-- ... Add similar policies for other tables

-- Create policies for todo_items
create policy "Users can view their own todo items"
    on todo_items for select
    using (auth.uid() = user_id);

create policy "Users can insert their own todo items"
    on todo_items for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own todo items"
    on todo_items for update
    using (auth.uid() = user_id);

create policy "Users can delete their own todo items"
    on todo_items for delete
    using (auth.uid() = user_id);
