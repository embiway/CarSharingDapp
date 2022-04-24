cd 'blockchain'
pwd
brownie compile

brownie run scripts/deploy.py --network ganache-local > addresses
cat addresses

echo -n 'REACT_APP_CAROKEN_ADDRESS=' > in
awk '{if(NR==11) print $0}' addresses >> in
echo -n 'REACT_APP_PAYMENTPROCESSOR_ADDRESS=' >> in
awk '{if(NR==25) print $0}' addresses >> in
echo -n 'REACT_APP_CARSHARE_ADDRESS=' >> in
awk '{if(NR==31) print $0}' addresses >> in

cp in '../frontend/.env'

cp -RT 'build/contracts' '../frontend/src/contractABI'

cd '../frontend'
npm start