import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { operation_type, user_ids, data, format } = await req.json();

    let result: any = {};

    switch (operation_type) {
      case 'bulk_create':
        result = await handleBulkCreate(supabase, data);
        break;
      case 'bulk_update':
        result = await handleBulkUpdate(supabase, user_ids, data);
        break;
      case 'bulk_delete':
        result = await handleBulkDelete(supabase, user_ids);
        break;
      case 'bulk_export':
        result = await handleBulkExport(supabase, user_ids, format);
        break;
      default:
        throw new Error('Invalid operation type');
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Bulk operation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleBulkCreate(supabase: any, userData: any[]) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(userData)
    .select();

  if (error) throw error;

  return {
    created_count: data.length,
    created_users: data
  };
}

async function handleBulkUpdate(supabase: any, userIds: string[], updateData: any) {
  const results = [];
  
  for (const userId of userIds) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      results.push({ user_id: userId, success: false, error: error.message });
    } else {
      results.push({ user_id: userId, success: true, data });
    }
  }

  return {
    updated_count: results.filter(r => r.success).length,
    failed_count: results.filter(r => !r.success).length,
    results
  };
}

async function handleBulkDelete(supabase: any, userIds: string[]) {
  const { error } = await supabase
    .from('user_profiles')
    .delete()
    .in('id', userIds);

  if (error) throw error;

  return {
    deleted_count: userIds.length
  };
}

async function handleBulkExport(supabase: any, userIds: string[], format: string) {
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('*')
    .in('id', userIds);

  if (error) throw error;

  // Format data based on export format
  switch (format) {
    case 'csv':
      return generateCSV(users);
    case 'excel':
      return generateExcel(users);
    case 'pdf':
      return generatePDF(users);
    default:
      return users;
  }
}

function generateCSV(users: any[]) {
  const headers = [
    'Full Name', 'Email', 'Role', 'Status', 'Admission/Employee Number',
    'Contact Number', 'Department', 'Current Standard', 'Section',
    'Accommodation Type', 'Peer Group', 'Date Created'
  ];

  const csvContent = [
    headers.join(','),
    ...users.map(user => [
      `"${user.full_name || ''}"`,
      `"${user.email || ''}"`,
      `"${user.role || ''}"`,
      `"${user.status || ''}"`,
      `"${user.admission_number || user.employee_id || ''}"`,
      `"${user.contact_number || ''}"`,
      `"${user.department || ''}"`,
      `"${user.current_standard || ''}"`,
      `"${user.section || ''}"`,
      `"${user.accommodation_type || ''}"`,
      `"${user.peer_group || ''}"`,
      `"${new Date(user.created_at).toLocaleDateString()}"`
    ].join(','))
  ].join('\n');

  return {
    content: csvContent,
    filename: `users_export_${new Date().toISOString().split('T')[0]}.csv`,
    mime_type: 'text/csv'
  };
}

function generateExcel(users: any[]) {
  // In a real implementation, this would use a library like xlsx
  return generateCSV(users); // Fallback to CSV for now
}

function generatePDF(users: any[]) {
  // In a real implementation, this would use a PDF generation library
  return {
    content: JSON.stringify(users, null, 2),
    filename: `users_export_${new Date().toISOString().split('T')[0]}.json`,
    mime_type: 'application/json'
  };
}