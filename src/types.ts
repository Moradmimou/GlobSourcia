export interface User {
  id: number;
  uid?: string;
  email: string;
  name: string;
  role: 'customer' | 'sourcing_agent' | 'shipping_agent' | 'admin';
  type?: 'company' | 'personal';
  company_details?: any;
  phone?: string;
  avatar_url?: string;
  isBlocked?: boolean;
  status?: 'active' | 'blocked' | 'deactivated';
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    currency: string;
    language: string;
  };
}

export interface Product {
  id?: number;
  name: string;
  category: string;
  photo_urls: string[];
  website_link: string;
  quantity: number;
  unit: string;
  budget: number;
  note: string;
}

export interface RFQ {
  id: number;
  customer_id: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid' | 'assigned' | 'sourcing' | 'shipping' | 'offered' | 'ordered' | 'shipped';
  origin_country: string;
  destination_country: string;
  delivery_mode: 'air' | 'sea' | 'land' | '';
  quality_level: 'high' | 'medium' | 'low' | '';
  total_budget: number;
  currency: string;
  payment_status: 'pending' | 'paid';
  payment_proof?: string;
  payment_date?: string;
  billing_type?: 'receipt' | 'invoice';
  sourcing_agent_id?: number;
  shipping_agent_id?: number;
  products: Product[];
  created_at: string;
}

export interface Offer {
  id: number;
  rfq_id: number;
  sourcing_agent_id: number;
  shipping_agent_id?: number;
  status: 'sourcing_pending' | 'shipping_pending' | 'ready' | 'accepted' | 'declined';
  unit_price: number;
  total_exw: number;
  shipping_cost?: number;
  customs_cost?: number;
  commission?: number;
  total_cost?: number;
  production_time: string;
  delivery_deadline?: string;
  validity_date: string;
  shipping_details?: any;
  created_at: string;
  // New fields for sourcing agent offers
  quantity?: number;
  quality_level?: string;
  delivery_mode?: string;
  delivery_sub_mode?: string;
  volume_cbm?: number;
  gross_weight_kg?: number;
  offer_validity?: string;
  payment_terms?: string;
  exw_charges?: number;
  total_cfr?: number;
  remarks?: string;
  supplier_name?: string;
  supplier_address?: string;
  supplier_contact_person?: string;
  supplier_email?: string;
  hs_code?: string;
  offer_pi_url?: string;
  moq?: number;
}

export interface Supplier {
  id: number;
  name: string;
  category: string;
  country: string;
  address?: string;
  contact_person?: string;
  contact_email?: string;
  rating?: number;
  created_at?: string;
}

export interface Shipment {
  id: number;
  tracking_number: string;
  carrier: string;
  status: 'pending' | 'booked' | 'in_transit' | 'customs' | 'delivered' | 'delayed';
  origin: string;
  destination: string;
  estimated_delivery: string;
  last_update: string;
  items?: RFQ[];
  updates: {
    date: string;
    location: string;
    description: string;
  }[];
  created_at: string;
  customer_id: number;
  customer_uid?: string;
  sourcing_agent_id: number;
  sourcing_agent_uid?: string;
  shipping_agent_id: number;
  shipping_agent_uid?: string;
  rfq_id: number;
  offer_id: number;
  transport_mode?: string;
  packing_details?: string;
  total_value?: number;
  purchase_cost?: number;
  freight_cost?: number;
  customs_cost?: number;
  selling_price?: number;
  shipping_line?: string;
  booking_number?: string;
  bl_number?: string;
  free_time?: string;
  cut_off?: string;
  etd?: string;
  eta?: string;
  transit_time?: string;
  delivery_date?: string;
}

export interface Invoice {
  id: number;
  rfq_id: number;
  customer_id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled';
  type: 'sourcing_fee' | 'product_payment' | 'shipping_fee' | 'receipt';
  due_date: string;
  paid_at?: string;
  created_at: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string;
  updatedAt: any;
  participantDetails: {
    [uid: string]: {
      name: string;
      role: string;
      avatar_url?: string;
    }
  };
  relatedId?: string | number;
  relatedType?: 'RFQ' | 'Order' | 'Shipment' | 'Invoice';
  typing?: {
    [uid: string]: boolean;
  };
  unreadCount?: {
    [uid: string]: number;
  };
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  createdAt: any;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  readBy?: string[];
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  content: string;
  excerpt: string;
}

export interface SampleRequest {
  id: number;
  rfq_id: number;
  offer_id: number;
  customer_id: number;
  sourcing_agent_id?: number;
  shipping_agent_id?: number;
  status: 'pending' | 'sourcing_priced' | 'shipping_priced' | 'ready' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  details: string;
  sample_cost?: number;
  shipping_cost?: number;
  total_cost?: number;
  payment_status: 'pending' | 'paid';
  payment_proof?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}
