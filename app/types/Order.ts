export type Order = {
    order_hash: string;
    maker_asset_bundle: {
      assets: Array<{
        name: string;
        image_url: string;
        description: string;
      }>;
    };
    current_price: string;
  };