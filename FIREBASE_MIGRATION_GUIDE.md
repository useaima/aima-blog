# Firebase Migration Guide for Aima Blog

This guide explains how to migrate from the current MySQL database to Firebase Realtime Database or Firestore.

## Option 1: Firebase Realtime Database (Recommended for Real-time Features)

### Advantages
- Real-time synchronization
- Excellent for live updates (comments, subscribers)
- Simpler data model
- Built-in authentication integration

### Disadvantages
- Less powerful querying
- Higher costs at scale
- Limited offline support

### Setup Instructions

#### 1. Create Firebase Project

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init
```

#### 2. Install Firebase SDK

```bash
pnpm add firebase
```

#### 3. Create Firebase Configuration

Create `server/_core/firebase.ts`:

```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const db = getDatabase(app);
export const auth = getAuth(app);
```

#### 4. Create Database Queries

Create `server/firebase-db.ts` to replace `server/db.ts`:

```typescript
import { db } from './_core/firebase';
import { ref, get, set, update, push, query, orderByChild, limitToLast } from 'firebase-admin/database';

// Articles
export async function getArticles(limit = 50) {
  const articlesRef = ref(db, 'articles');
  const snapshot = await get(articlesRef);
  if (!snapshot.exists()) return [];
  
  const articles = Object.entries(snapshot.val()).map(([id, data]: any) => ({
    id,
    ...data,
  }));
  
  return articles
    .filter((a: any) => a.status === 'published')
    .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getArticleBySlug(slug: string) {
  const articlesRef = ref(db, 'articles');
  const snapshot = await get(articlesRef);
  if (!snapshot.exists()) return undefined;
  
  const articles = Object.entries(snapshot.val());
  const [id, article] = articles.find(([_, a]: any) => a.slug === slug) || [];
  
  return article ? { id, ...article } : undefined;
}

export async function createArticle(data: any) {
  const articlesRef = ref(db, 'articles');
  const newArticleRef = push(articlesRef);
  await set(newArticleRef, {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return { id: newArticleRef.key, ...data };
}

// Add more functions following this pattern...
```

#### 5. Update tRPC Procedures

Update `server/routers/blog.ts` to use Firebase functions instead of database functions.

#### 6. Environment Variables

Add to `.env`:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
```

---

## Option 2: Firebase Firestore (Recommended for Complex Queries)

### Advantages
- Powerful querying capabilities
- Better for complex data relationships
- Automatic indexing
- Scales better than Realtime Database

### Disadvantages
- Slightly higher latency
- More complex data model
- Higher costs for reads

### Setup Instructions

#### 1. Initialize Firestore

```bash
firebase init firestore
```

#### 2. Install Firestore SDK

```bash
pnpm add firebase-admin
```

#### 3. Create Firestore Configuration

Create `server/_core/firestore.ts`:

```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

const app = initializeApp({
  credential: cert(serviceAccount),
});

export const firestore = getFirestore(app);
```

#### 4. Create Firestore Queries

Create `server/firestore-db.ts`:

```typescript
import { firestore } from './_core/firestore';
import { collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc, doc } from 'firebase-admin/firestore';

// Articles
export async function getArticles(limit_count = 50) {
  const q = query(
    collection(firestore, 'articles'),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc'),
    limit(limit_count)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getArticleBySlug(slug: string) {
  const q = query(
    collection(firestore, 'articles'),
    where('slug', '==', slug),
    limit(1)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return undefined;
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function createArticle(data: any) {
  const docRef = await addDoc(collection(firestore, 'articles'), {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return { id: docRef.id, ...data };
}

// Add more functions following this pattern...
```

---

## Migration Steps

### Phase 1: Preparation (Week 1)

1. **Backup Current Data**
   ```bash
   mysqldump -u root -p aima_blog > backup.sql
   ```

2. **Export Data to JSON**
   Create a script to export MySQL data to JSON format

3. **Set Up Firebase Project**
   - Create Firebase project
   - Enable Firestore/Realtime Database
   - Create service account
   - Download credentials

### Phase 2: Data Migration (Week 2)

1. **Write Migration Script**
   ```typescript
   // scripts/migrate-to-firebase.ts
   import { db as firestore } from '../server/_core/firestore';
   import mysql from 'mysql2/promise';
   
   async function migrateData() {
     // Connect to MySQL
     const connection = await mysql.createConnection({
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME,
     });
     
     // Fetch and migrate articles
     const [articles] = await connection.execute('SELECT * FROM articles');
     
     for (const article of articles) {
       await firestore.collection('articles').add(article);
     }
     
     await connection.end();
   }
   
   migrateData().catch(console.error);
   ```

2. **Run Migration**
   ```bash
   pnpm tsx scripts/migrate-to-firebase.ts
   ```

3. **Verify Data**
   - Check Firebase console
   - Verify document counts
   - Sample data validation

### Phase 3: Code Updates (Week 3)

1. **Update Database Layer**
   - Replace `server/db.ts` with Firebase version
   - Update all query functions

2. **Update tRPC Procedures**
   - Test all procedures
   - Verify type safety

3. **Update Frontend**
   - Test all data fetching
   - Verify real-time updates

### Phase 4: Testing & Deployment (Week 4)

1. **Integration Testing**
   - Test all CRUD operations
   - Test search and filtering
   - Test real-time updates

2. **Performance Testing**
   - Compare query performance
   - Monitor costs
   - Optimize indexes

3. **Gradual Rollout**
   - Deploy to staging
   - Run parallel with MySQL
   - Monitor for issues
   - Switch production traffic

---

## Cost Comparison

### Firebase Realtime Database
- **Storage**: $1 per GB/month
- **Bandwidth**: $1 per GB
- **Good for**: Real-time updates, smaller datasets

### Firebase Firestore
- **Reads**: $0.06 per 100K reads
- **Writes**: $0.18 per 100K writes
- **Storage**: $0.18 per GB/month
- **Good for**: Complex queries, larger datasets

### MySQL (Current)
- **Manus Hosted**: Included with web-db-user feature
- **Good for**: Complex relationships, transactions

---

## Recommendation

**For Aima Blog, I recommend:**

1. **Short-term**: Keep MySQL for now (already set up and working)
2. **Medium-term**: Use Firebase Realtime Database for real-time features (comments, live updates)
3. **Long-term**: Consider Firestore if you need more complex querying

**Hybrid Approach**:
- Keep MySQL for articles, authors (less real-time)
- Use Firebase Realtime Database for comments, subscribers (real-time)
- Use Firebase Auth for user management

---

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Pricing Calculator](https://firebase.google.com/pricing)

---

## Next Steps

1. **Evaluate**: Determine if Firebase is right for your use case
2. **Prototype**: Set up a Firebase project and test with sample data
3. **Plan**: Create a detailed migration timeline
4. **Execute**: Follow the migration steps above
5. **Monitor**: Track performance and costs after migration

For questions or issues, refer to the Firebase documentation or contact Firebase support.
