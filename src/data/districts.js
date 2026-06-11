/**
 * Maharashtra district locations for the Kisan Sarthi map.
 * @type {Array<{name: string, lat: number, lon: number}>}
 */
export const DISTRICTS = [
  { name: "Nashik", lat: 20.00, lon: 73.70 },
  { name: "Pune", lat: 18.52, lon: 73.85 },
  { name: "Solapur", lat: 17.68, lon: 75.90 },
  { name: "Aurangabad", lat: 19.88, lon: 75.34 },
  { name: "Nagpur", lat: 21.15, lon: 79.09 },
];

export const DISTRICT_BOUNDS = {
  Nashik: [
    [20.5, 73.0], [20.8, 73.8], [20.4, 74.5], [19.7, 74.4], [19.5, 73.8], [19.6, 73.2]
  ],
  Pune: [
    [19.2, 73.5], [19.1, 74.3], [18.5, 75.1], [17.9, 74.8], [18.0, 73.8], [18.4, 73.2]
  ],
  Solapur: [
    [18.3, 75.5], [18.1, 76.3], [17.5, 76.2], [17.1, 75.8], [17.2, 75.0], [17.8, 75.1]
  ],
  Aurangabad: [
    [20.6, 75.0], [20.5, 75.8], [20.0, 76.1], [19.5, 75.6], [19.4, 74.8], [20.1, 74.7]
  ],
  Nagpur: [
    [21.7, 78.8], [21.6, 79.5], [21.1, 79.8], [20.7, 79.4], [20.8, 78.6], [21.3, 78.5]
  ]
};

