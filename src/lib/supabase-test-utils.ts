import { supabase } from './supabase';
import { logError } from './monitoring';

export async function createTestUser() {
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Test123!@#';

    const { data: { user }, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          company_name: 'Test Company'
        }
      }
    });

    if (error) throw error;
    return { user, email: testEmail, password: testPassword };
  } catch (error) {
    logError(error as Error, { context: 'test-user-creation' });
    throw error;
  }
}

export async function cleanupTestUser(userId: string) {
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
  } catch (error) {
    logError(error as Error, { context: 'test-user-cleanup' });
    throw error;
  }
}

export async function testDatabaseOperations() {
  const testData = {
    table: 'test_records',
    record: { name: 'Test Record', created_at: new Date().toISOString() }
  };

  try {
    // Test insert
    const { data: inserted, error: insertError } = await supabase
      .from(testData.table)
      .insert(testData.record)
      .select()
      .single();
    
    if (insertError) throw insertError;

    // Test read
    const { data: read, error: readError } = await supabase
      .from(testData.table)
      .select()
      .eq('id', inserted.id)
      .single();
    
    if (readError) throw readError;

    // Test update
    const { data: updated, error: updateError } = await supabase
      .from(testData.table)
      .update({ name: 'Updated Test Record' })
      .eq('id', inserted.id)
      .select()
      .single();
    
    if (updateError) throw updateError;

    // Test delete
    const { error: deleteError } = await supabase
      .from(testData.table)
      .delete()
      .eq('id', inserted.id);
    
    if (deleteError) throw deleteError;

    return {
      success: true,
      operations: {
        insert: inserted,
        read,
        update: updated,
        delete: 'success'
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'database-operations-test' });
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

export async function testStorageOperations() {
  const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
  const bucket = 'public';
  const path = `test/${Date.now()}-${testFile.name}`;

  try {
    // Test upload
    const { data: uploaded, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, testFile);
    
    if (uploadError) throw uploadError;

    // Test download
    const { data: downloaded, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(path);
    
    if (downloadError) throw downloadError;

    // Test delete
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (deleteError) throw deleteError;

    return {
      success: true,
      operations: {
        upload: uploaded,
        download: downloaded,
        delete: 'success'
      }
    };
  } catch (error) {
    logError(error as Error, { context: 'storage-operations-test' });
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

export async function testRealtimeSubscription() {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({
        success: false,
        error: 'Realtime subscription test timed out'
      });
    }, 5000);

    const channel = supabase.channel('test')
      .on('presence', { event: 'sync' }, () => {
        clearTimeout(timeout);
        channel.unsubscribe();
        resolve({
          success: true,
          details: 'Realtime subscription test passed'
        });
      })
      .subscribe();
  });
}