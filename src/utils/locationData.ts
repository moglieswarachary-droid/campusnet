import { StateUTMaster } from '../types';

/**
 * Normalized Master Table covering all 28 States and 8 Union Territories of India (36 entities)
 * with their major districts and cities.
 */
export const INDIA_STATES_AND_UTS: StateUTMaster[] = [
  // 28 States
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    type: 'state',
    districts: ['Chittoor', 'Kuppam', 'Tirupati', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Kadapa', 'Kakinada', 'Anantapur']
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    type: 'state',
    districts: ['Papum Pare', 'Itanagar', 'Tawang', 'Changlang', 'East Siang', 'Pasighat', 'Lower Subansiri']
  },
  {
    code: 'AS',
    name: 'Assam',
    type: 'state',
    districts: ['Kamrup Metropolitan', 'Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tezpur', 'Cachar']
  },
  {
    code: 'BR',
    name: 'Bihar',
    type: 'state',
    districts: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Nalanda', 'Begusarai']
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    type: 'state',
    districts: ['Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Korba', 'Rajnandgaon', 'Jagdalpur']
  },
  {
    code: 'GA',
    name: 'Goa',
    type: 'state',
    districts: ['North Goa', 'South Goa', 'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa']
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    type: 'state',
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Anand', 'Jamnagar']
  },
  {
    code: 'HR',
    name: 'Haryana',
    type: 'state',
    districts: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat']
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    type: 'state',
    districts: ['Shimla', 'Kangra', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Hamirpur']
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    type: 'state',
    districts: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar']
  },
  {
    code: 'KA',
    name: 'Karnataka',
    type: 'state',
    districts: ['Bengaluru Urban', 'Surathkal', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Udupi', 'Shivamogga']
  },
  {
    code: 'KL',
    name: 'Kerala',
    type: 'state',
    districts: ['Thiruvananthapuram', 'Ernakulam', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur', 'Kottayam']
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    type: 'state',
    districts: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna']
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    type: 'state',
    districts: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Kolhapur', 'Solapur', 'Navi Mumbai']
  },
  {
    code: 'MN',
    name: 'Manipur',
    type: 'state',
    districts: ['Imphal West', 'Imphal East', 'Churachandpur', 'Thoubal', 'Bishnupur']
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    type: 'state',
    districts: ['East Khasi Hills', 'Shillong', 'West Garo Hills', 'Tura', 'Ri-Bhoi']
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    type: 'state',
    districts: ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib', 'Serchhip']
  },
  {
    code: 'NL',
    name: 'Nagaland',
    type: 'state',
    districts: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha']
  },
  {
    code: 'OR',
    name: 'Odisha',
    type: 'state',
    districts: ['Khordha', 'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore']
  },
  {
    code: 'PB',
    name: 'Punjab',
    type: 'state',
    districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot']
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    type: 'state',
    districts: ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Bikaner', 'Ajmer', 'Pilani', 'Alwar', 'Bhilwara']
  },
  {
    code: 'SK',
    name: 'Sikkim',
    type: 'state',
    districts: ['East Sikkim', 'Gangtok', 'Namchi', 'Mangan', 'Gyalshing']
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    type: 'state',
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Kanchipuram']
  },
  {
    code: 'TG',
    name: 'Telangana',
    type: 'state',
    districts: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Rangareddy', 'Medchal']
  },
  {
    code: 'TR',
    name: 'Tripura',
    type: 'state',
    districts: ['West Tripura', 'Agartala', 'Gomati', 'Unakoti', 'Dhalai']
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    type: 'state',
    districts: ['Lucknow', 'Kanpur', 'Noida', 'Greater Noida', 'Varanasi', 'Prayagraj', 'Agra', 'Ghaziabad', 'Meerut', 'Aligarh']
  },
  {
    code: 'UT',
    name: 'Uttarakhand',
    type: 'state',
    districts: ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital', 'Pantnagar', 'Rishikesh', 'Haldwani']
  },
  {
    code: 'WB',
    name: 'West Bengal',
    type: 'state',
    districts: ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol', 'Kharagpur', 'Darjeeling', 'Bardhaman']
  },

  // 8 Union Territories
  {
    code: 'AN',
    name: 'Andaman and Nicobar Islands',
    type: 'ut',
    districts: ['Port Blair', 'South Andaman', 'North and Middle Andaman', 'Nicobar']
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    type: 'ut',
    districts: ['Chandigarh']
  },
  {
    code: 'DN',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'ut',
    districts: ['Daman', 'Diu', 'Silvassa']
  },
  {
    code: 'DL',
    name: 'Delhi (NCT)',
    type: 'ut',
    districts: ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Dwarka', 'Rohini']
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
    type: 'ut',
    districts: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Pulwama']
  },
  {
    code: 'LA',
    name: 'Ladakh',
    type: 'ut',
    districts: ['Leh', 'Kargil']
  },
  {
    code: 'LD',
    name: 'Lakshadweep',
    type: 'ut',
    districts: ['Kavaratti', 'Agatti', 'Minicoy', 'Amini']
  },
  {
    code: 'PY',
    name: 'Puducherry',
    type: 'ut',
    districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
  }
];

export const INDIAN_STATES = INDIA_STATES_AND_UTS.filter(s => s.type === 'state');
export const INDIAN_UNION_TERRITORIES = INDIA_STATES_AND_UTS.filter(s => s.type === 'ut');

export const ALL_STATE_AND_UT_NAMES = INDIA_STATES_AND_UTS.map(s => s.name);

export function getDistrictsByStateName(stateName: string): string[] {
  if (!stateName || stateName === 'All India') return [];
  const found = INDIA_STATES_AND_UTS.find(
    s => s.name.toLowerCase() === stateName.toLowerCase() || s.code.toLowerCase() === stateName.toLowerCase()
  );
  return found ? found.districts : ['Main District / City'];
}
