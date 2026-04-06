export type OfferStateVariant = 'unavailable' | 'ended';

export type AdPageRecord = {
  id: string;
  title: string;
  offer_text: string;
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
  name: string;
  email: string;
  phone: string;
  ad: {
    title: string;
  } | null;
};

export type LeadQueryRow = {
  id: string;
  created_at: string;
  ad_id: string;
  name: string;
  email: string;
  phone: string;
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
