const mockMqtt = {
  connect: jest.fn(() => ({
    on: jest.fn(),
    once: jest.fn(),
    end: jest.fn()
  }))
}

export default mockMqtt; 