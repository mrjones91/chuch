import { useSeoMeta } from '@unhead/react';
import { Link } from 'react-router-dom';
import { LoginArea } from '@/components/auth/LoginArea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, Church } from 'lucide-react';

const Index = () => {
  useSeoMeta({
    title: 'Welcome to Chuch',
    description: 'Chuch - Connecting the Black Church via A modern Nostr client application built with React, TailwindCSS, and Nostrify.',
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation/Header Area */}
      <header className="w-full p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Chuch
          </h1>
          <div className="flex items-center gap-4">
            <LoginArea className="max-w-60" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Welcome to Chuch!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Continue to fellowship and grow the body of Christ
        </p>

        {/* Three Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Bible Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Bible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/bible/read"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read the Bible
                </Link>
                <Link 
                  to="/bible/plans"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Reading Plans
                </Link>
              </nav>
            </CardContent>
          </Card>

          {/* Study Groups Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Study Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/groups/your"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Your Groups
                </Link>
                <Link 
                  to="/groups/church"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Church Groups
                </Link>
                <Link 
                  to="/groups/nearby"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Nearby Groups
                </Link>
                <Link 
                  to="/groups/national"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  National Groups
                </Link>
              </nav>
            </CardContent>
          </Card>

          {/* Ministries Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Church className="h-5 w-5" />
                Ministries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-2">
                <Link 
                  to="/ministries/your"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Your Ministries
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
