import { NextResponse } from 'next/server';
import { Order } from '@/app/types/Order';

export async function GET() {
  const apiKey = process.env.OPENSEA_API_KEY;
  
  console.log('API Key:', apiKey ? 'Present (length: ' + apiKey.length + ')' : 'Missing');

  if (!apiKey) {
    console.error('API key not configured');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    console.log('Fetching NFTs from OpenSea...');
    const url = 'https://api.opensea.io/v2/orders/ethereum/seaport/listings?limit=20';
    console.log('URL:', url);

    const response = await fetch(url, {
      headers: {
        'X-API-KEY': apiKey,
        'Accept': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(response.headers, null, 2));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`OpenSea API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched NFTs. Data structure:', JSON.stringify(Object.keys(data), null, 2));
    
    if (!data.orders) {
      console.error('Unexpected data structure:', JSON.stringify(data, null, 2));
      throw new Error('Unexpected data structure received from OpenSea API');
    }

    const nfts = data.orders.map((order: Order) => ({
      id: order.order_hash,
      name: order.maker_asset_bundle.assets[0].name || 'Unnamed NFT',
      price: order.current_price,
      image: order.maker_asset_bundle.assets[0].image_url || '/placeholder.svg?height=400&width=400',
      description: order.maker_asset_bundle.assets[0].description || 'No description available',
    }));

    return NextResponse.json(nfts);
  } catch (error: unknown) {
    console.error('Error fetching NFTs:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch NFTs', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to fetch NFTs', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}