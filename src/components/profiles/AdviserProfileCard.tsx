'use client';

import { AdviserDetail } from '@/types/adviserType';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface AdviserProfileCardProps {
  adviser: AdviserDetail;
  showActions?: boolean;
}

export default function AdviserProfileCard({ adviser, showActions = true }: AdviserProfileCardProps) {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/mentors/${adviser.uuid}`);
  };

  return (
    <Card className="w-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          {adviser.profileImage ? (
            <Image
              src={adviser.profileImage}
              alt={adviser.name || 'Adviser'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">{adviser.name?.charAt(0) || 'A'}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <CardTitle className="text-xl font-bold">{adviser.name}</CardTitle>
        <CardDescription className="text-sm text-gray-500 mt-1">
          {adviser.specialization || 'Adviser'}
        </CardDescription>
        
        <div className="mt-3">
          <p className="text-sm text-gray-700 line-clamp-3">
            {adviser.bio || 'No bio available'}
          </p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {adviser.institution && (
            <Badge variant="outline" className="bg-blue-50">
              {adviser.institution}
            </Badge>
          )}
          {adviser.yearsOfExperience && (
            <Badge variant="outline" className="bg-green-50">
              {adviser.yearsOfExperience} years experience
            </Badge>
          )}
          {adviser.isAvailable && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Available
            </Badge>
          )}
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button variant="outline" onClick={handleViewProfile}>
            View Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}