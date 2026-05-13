import { query } from './connection';

export async function initializeDatabase(): Promise<void> {
  console.log('Initializing database schema...');

  try {
    // Create extensions
    await query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'parent', 'tutor', 'admin')),
        name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(500),
        bio TEXT,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);

    // Create tutors table
    await query(`
      CREATE TABLE IF NOT EXISTS tutors (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subjects JSONB,
        hourly_rate DECIMAL(10, 2),
        qualifications TEXT,
        bio TEXT,
        profile_image_url VARCHAR(500),
        average_rating DECIMAL(3, 2) DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_tutors_user_id ON tutors(user_id);
      CREATE INDEX IF NOT EXISTS idx_tutors_location ON tutors(location);
      CREATE INDEX IF NOT EXISTS idx_tutors_subjects ON tutors USING GIN(subjects);
    `);

    // Create availability table
    await query(`
      CREATE TABLE IF NOT EXISTS availability (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
        day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
        start_time TIME,
        end_time TIME,
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_availability_tutor ON availability(tutor_id);
    `);

    // Create bookings table
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
        session_date DATE,
        start_time TIME,
        duration_minutes INTEGER,
        subject VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        cancellation_reason TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings(student_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_tutor ON bookings(tutor_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(session_date);
    `);

    // Create messages table
    await query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        participant_1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        participant_2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_conversations_participants 
        ON conversations(participant_1_id, participant_2_id);
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_unread 
        ON messages(conversation_id) WHERE is_read = FALSE;
    `);

    // Create reviews table
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
        reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_reviews_tutor ON reviews(tutor_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
    `);

    console.log('✓ Database schema initialized successfully');
  } catch (error) {
    console.error('✗ Database initialization failed:', error);
    throw error;
  }
}

export async function dropDatabase(): Promise<void> {
  console.log('Dropping all tables...');

  try {
    await query(`
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS conversations CASCADE;
      DROP TABLE IF EXISTS bookings CASCADE;
      DROP TABLE IF EXISTS availability CASCADE;
      DROP TABLE IF EXISTS tutors CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    console.log('✓ All tables dropped');
  } catch (error) {
    console.error('✗ Failed to drop tables:', error);
    throw error;
  }
}
