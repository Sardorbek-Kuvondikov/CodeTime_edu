# CodeTime Supabase Setup

Bu loyiha hamma foydalanuvchilarda bir xil coin ro'yxatini ko'rsatishi uchun Supabase free backend ishlatadi.

1. Supabase'da free project yarating.
2. `supabase/schema.sql` ichidagi SQL'ni Supabase SQL Editor'da run qiling.
3. Authentication > Users bo'limida teacher user yarating.
   Masalan: `anvar@codetime.local`
4. `schema.sql` oxiridagi `teacher_profiles` insert SQL'ini o'sha emailga moslab run qiling.
5. `.env.example`dan nusxa olib `.env` yarating va Supabase URL/key qo'ying.
6. Vercel yoki Netlify project settings ichida ham shu env qiymatlarini qo'shing.

Teacher login formida login sifatida `anvar` yozilsa, app uni `anvar@codetime.local`ga aylantiradi. Email bilan ham kirish mumkin.

