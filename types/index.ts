export type OfferStateVariant = 'unavailable' | 'ended';

export type AdPageRecord = {
  id: string;
  title: string;
  offer_text: string;
  redemption_instructions: string | null;
  logo_url: string | null;
  active: boolean;
  advertiser: {
    name: string;
  } | null;
};

export type AdPageQueryRow = {
  id: string;
  title: string;
  offer_text: string;
  redemption_instructions: string | null;
  logo_url: string | null;
  active: boolean;
  advertiser:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

export type LeadRow = {
  id: string;
  created_at: string;
  ad_id: string;
  advertiser_id: string | null;
  name: string;
  email: string;
  phone: string;
  advertiser: {
    name: string;
  } | null;
  ad: {
    title: string;
  } | null;
};

export type LeadQueryRow = {
  id: string;
  created_at: string;
  ad_id: string;
  advertiser_id?: string | null;
  name: string;
  email: string;
  phone: string;
  advertiser:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
  ad:
    | {
        title: string;
      }
    | {
        title: string;
      }[]
    | null;
};

export type LoginFormState = {
  error: string | null;
};

export type AdSetupFormState = {
  error: string | null;
  publicUrl: string | null;
  absoluteUrl: string | null;
};

export type AdminDashboardAdRow = {
  id: string;
  title: string;
  active: boolean;
  created_at: string;
  advertiser: {
    name: string;
  } | null;
};

export type AdminDashboardAdQueryRow = {
  id: string;
  title: string;
  active: boolean;
  created_at: string;
  advertiser:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

export type AdminPerformanceRow = {
  id: string;
  advertiserName: string;
  title: string;
  active: boolean;
  visits: number;
  leads: number;
  conversionRate: number;
  lastVisit: string | null;
  lastLead: string | null;
  publicUrl: string;
};
