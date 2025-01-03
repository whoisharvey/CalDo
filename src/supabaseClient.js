import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rvvsmuprstjohxxrlfof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2dnNtdXByc3Rqb2h4eHJsZm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4NTE4NDMsImV4cCI6MjA1MTQyNzg0M30.sU5-wPRUP2jXjXtSHYgXSgXXJwsxlLsOVaSqvpABRmM';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
