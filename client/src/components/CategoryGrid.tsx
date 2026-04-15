import { Link } from 'wouter';
import { Category } from '@/lib/mockData';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`}>
          <a className="group block p-6 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border hover:border-accent">
            {/* Category Icon/Color Bar */}
            <div className="w-12 h-12 rounded-lg mb-4" style={{ backgroundColor: category.color }} />

            {/* Category Name */}
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
              {category.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground">{category.description}</p>

            {/* Arrow */}
            <div className="mt-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
