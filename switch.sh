#!/bin/bash
set -e
TARGET="${1:-dev}"
if [ "$TARGET" = "dev" ]; then
  sed -i 's|basePath: "/wendo"|basePath: "/wendo-dev"|g' next.config.ts
  sed -i 's|assetPrefix: "/wendo"|assetPrefix: "/wendo-dev"|g' next.config.ts
  echo "DEV mode"
elif [ "$TARGET" = "prod" ]; then
  sed -i 's|basePath: "/wendo-dev"|basePath: "/wendo"|g' next.config.ts
  sed -i 's|assetPrefix: "/wendo-dev"|assetPrefix: "/wendo"|g' next.config.ts
  echo "PROD mode"
fi
grep "basePath\|assetPrefix" next.config.ts
