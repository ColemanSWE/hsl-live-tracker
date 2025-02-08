import mqtt from 'mqtt';

// MQTT connection configuration
const MQTT_URL = 'wss://mqtt.hsl.fi:443/';
const TOPIC_PREFIX = '/hfp/v2/journey/ongoing/vp/+/+/+/+/#';

export interface VehiclePosition {
  id: string;
  route: string;
  direction: number;
  lat: number;
  long: number;
  speed: number;
  timestamp: number;
  operator: string;
  vehicleType: 'bus' | 'tram' | 'train' | 'metro' | 'ferry';
}

export const initRealtimeConnection = (
  onMessage: (vehicle: VehiclePosition) => void
) => {
  const client = mqtt.connect(MQTT_URL, {
    rejectUnauthorized: false,
    protocolVersion: 5, // MQTT 5.0
    reconnectPeriod: 5000, // Auto-reconnect every 5s
    connectTimeout: 3000
  });

  client.on('connect', () => {
    console.log('MQTT connected');
    client.subscribe(TOPIC_PREFIX, { qos: 1 }, (err) => {
      if (err) console.error('Subscription error:', err);
      else console.log('Subscribed to topics');
    });
  });

  client.on('error', (err) => {
    console.error('MQTT connection error:', err);
  });

  client.on('message', (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      const vp = data.VP;
      
      if (vp && vp.lat && vp.long) {
        onMessage({
          id: `${vp.oper}_${vp.veh}`,
          route: vp.desi,
          direction: parseInt(vp.dir, 10),
          lat: vp.lat,
          long: vp.long,
          speed: vp.spd,
          timestamp: new Date(vp.tst).getTime(),
          operator: vp.oper.toString(),
          vehicleType: getVehicleTypeFromTopic(topic)
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  return () => {
    client.end();
    console.log('MQTT connection closed');
  };
};

// Helper to extract vehicle type from MQTT topic
const getVehicleTypeFromTopic = (topic: string): VehiclePosition['vehicleType'] => {
  const parts = topic.split('/');
  return parts[6] as VehiclePosition['vehicleType'] || 'bus';
};