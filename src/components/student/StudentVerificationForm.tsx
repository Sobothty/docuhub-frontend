'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCreateStudentDetailMutation } from '@/feature/apiSlice/studentApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  GraduationCap, 
  Building, 
  BookOpen, 
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { StudentFormData, StudentFormErrors } from '@/types/studentType';

interface StudentVerificationFormProps {
  userUuid?: string;
  onSuccess?: () => void;
}

const UNIVERSITIES = [
  'Royal University of Phnom Penh',
  'University of Cambodia',
  'Cambodia University of Technology',
  'Institute of Technology of Cambodia',
  'American University of Cambodia',
  'University of Management and Economics',
  'Build Bright University',
  'Other'
];

const YEARS_OF_STUDY = ['1', '2', '3', '4', '5', '6'];

export default function StudentVerificationForm({ 
  userUuid, 
  onSuccess 
}: StudentVerificationFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [createStudentDetail, { isLoading, error }] = useCreateStudentDetailMutation();

  const [formData, setFormData] = useState<StudentFormData>({
    studentCardUrl: '',
    university: '',
    major: '',
    yearsOfStudy: ''
  });

  const [formErrors, setFormErrors] = useState<StudentFormErrors>({});
  const [isUploading, setIsUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors: StudentFormErrors = {};

    if (!formData.studentCardUrl.trim()) {
      errors.studentCardUrl = 'Student card image is required';
    }

    if (!formData.university.trim()) {
      errors.university = 'University is required';
    }

    if (!formData.major.trim()) {
      errors.major = 'Major is required';
    }

    if (!formData.yearsOfStudy) {
      errors.yearsOfStudy = 'Years of study is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof StudentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setFormErrors(prev => ({ 
        ...prev, 
        studentCardUrl: 'Please upload a valid image file (JPEG, JPG, or PNG)' 
      }));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setFormErrors(prev => ({ 
        ...prev, 
        studentCardUrl: 'File size must be less than 5MB' 
      }));
      return;
    }

    setIsUploading(true);
    try {
      // Here you would implement your file upload logic
      // For now, we'll simulate an upload with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock uploaded URL - replace with actual upload implementation
      const mockUrl = `https://s3.docuhub.me/student-cards/${Date.now()}-${file.name}`;
      handleInputChange('studentCardUrl', mockUrl);
      
      console.log('File uploaded successfully:', mockUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      setFormErrors(prev => ({ 
        ...prev, 
        studentCardUrl: 'Failed to upload file. Please try again.' 
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const currentUserUuid = userUuid || session?.user?.uuid;
    if (!currentUserUuid) {
      console.error('User UUID not found');
      return;
    }

    try {
      await createStudentDetail({
        ...formData,
        userUuid: currentUserUuid
      }).unwrap();

      setSubmitSuccess(true);
      console.log('Student verification submitted successfully');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/profile?tab=verification');
        }
      }, 2000);

    } catch (error) {
      console.error('Failed to submit student verification:', error);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-600 mb-2">
            Verification Submitted Successfully!
          </h2>
          <p className="text-muted-foreground mb-4">
            Your student verification request has been submitted. 
            Our admin team will review your documents and notify you of the result.
          </p>
          <Badge variant="outline" className="text-yellow-600">
            Status: Pending Review
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          Student Verification
        </CardTitle>
        <p className="text-muted-foreground">
          Submit your student information to get verified and access student features.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {'data' in error && error.data && typeof error.data === 'object' && 'details' in error.data
                  ? String(error.data.details)
                  : 'Failed to submit student verification. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Student Card Upload */}
          <div className="space-y-2">
            <Label htmlFor="studentCard" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Student Card Image *
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="studentCard"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <Label
                htmlFor="studentCard"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {isUploading 
                    ? 'Uploading...' 
                    : 'Click to upload your student card (JPEG, PNG, max 5MB)'
                  }
                </span>
              </Label>
              {formData.studentCardUrl && (
                <div className="mt-2">
                  <Badge variant="success" className="text-green-600">
                    ✓ File uploaded successfully
                  </Badge>
                </div>
              )}
            </div>
            {formErrors.studentCardUrl && (
              <p className="text-sm text-red-500">{formErrors.studentCardUrl}</p>
            )}
          </div>

          {/* University */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              University *
            </Label>
            <Select
              value={formData.university}
              onValueChange={(value) => handleInputChange('university', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your university" />
              </SelectTrigger>
              <SelectContent>
                {UNIVERSITIES.map((university) => (
                  <SelectItem key={university} value={university}>
                    {university}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.university && (
              <p className="text-sm text-red-500">{formErrors.university}</p>
            )}
          </div>

          {/* Major */}
          <div className="space-y-2">
            <Label htmlFor="major" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Major *
            </Label>
            <Input
              id="major"
              type="text"
              placeholder="e.g., Computer Science, Engineering, Business"
              value={formData.major}
              onChange={(e) => handleInputChange('major', e.target.value)}
            />
            {formErrors.major && (
              <p className="text-sm text-red-500">{formErrors.major}</p>
            )}
          </div>

          {/* Years of Study */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Years of Study *
            </Label>
            <Select
              value={formData.yearsOfStudy}
              onValueChange={(value) => handleInputChange('yearsOfStudy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS_OF_STUDY.map((year) => (
                  <SelectItem key={year} value={year}>
                    Year {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.yearsOfStudy && (
              <p className="text-sm text-red-500">{formErrors.yearsOfStudy}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Verification
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}