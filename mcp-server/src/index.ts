import 'dotenv/config'; 
import { createServer } from './app'; 

const app = createServer(); 
app.listen(3000, () => console.log('up'));