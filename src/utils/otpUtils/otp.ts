
// Generate a random OTP (One-Time Password)
export function generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let OTP = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      OTP += digits[randomIndex];
    }
  
    return OTP;
  }
  
  // Verify if the provided OTP matches the expected OTP
  export function verifyOTP(expectedOTP: string, providedOTP: string): boolean {
    return expectedOTP === providedOTP;
  }
  