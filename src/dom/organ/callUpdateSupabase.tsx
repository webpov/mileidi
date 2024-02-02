export const callUpdateSupabase = async (publicKey: string, amount: number) => {
  try {
    const response = await fetch('/api/auth/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicKey, amount }),
    });

    if (!response.ok) {
      // Handle non-2xx responses here
      console.error('Failed to call the API endpoint', response.statusText);
      return null;
    }

    const data: any = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling the API', error);
    return null;
  }


};
