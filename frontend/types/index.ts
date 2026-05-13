// User types
export type UserRole = 'student' | 'parent' | 'tutor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  userId: string;
  email?: string;
  token: string;
  refreshToken: string;
  role?: UserRole;
  message: string;
}

// Tutor types
export interface Subject {
  id: string;
  name: string;
}

export interface Tutor {
  id: string;
  userId: string;
  subjects: string[];
  hourlyRate: number;
  qualifications: string;
  bio: string;
  profileImageUrl?: string;
  averageRating: number;
  totalReviews: number;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface TutorProfile extends Tutor {
  user: User;
}

// Availability types
export interface Availability {
  id: string;
  tutorId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklySchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  studentId: string;
  studentName?: string;
  tutorId: string;
  tutorName?: string;
  sessionDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  subject: string;
  status: BookingStatus;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  tutorId: string;
  sessionDate: string;
  startTime: string;
  duration: number;
  subject: string;
}

// Message types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  text: string;
  isRead: boolean;
  bookingId?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName?: string;
  participantAvatar?: string;
  lastMessageAt?: string;
  lastMessage?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerName?: string;
  tutorId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  tutorId: string;
  bookingId: string;
  rating: number;
  comment: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pages?: number;
  limit?: number;
}

// Filter types
export interface TutorFilters {
  subject?: string;
  minRate?: number;
  maxRate?: number;
  location?: string;
  rating?: number;
  page?: number;
  limit?: number;
}

export interface BookingFilters {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

// Form types
export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: UserRole;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface TutorProfileFormData {
  subjects: string[];
  hourlyRate: number;
  qualifications: string;
  bio: string;
  location: string;
  profileImage?: File;
}

// Dashboard types
export interface DashboardStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  totalEarnings?: number;
  averageRating?: number;
  totalReviews?: number;
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// Search types
export interface SearchResults {
  tutors: Tutor[];
  total: number;
  page: number;
}

// Time slot types
export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DateTimeSlots {
  date: string;
  slots: TimeSlot[];
}

// Export all types
export type {
  User,
  Tutor,
  Booking,
  Message,
  Conversation,
  Review,
  Availability,
  Subject,
};
