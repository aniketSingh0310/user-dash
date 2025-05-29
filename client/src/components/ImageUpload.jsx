import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Image,
  Text,
  Progress,
  Flex,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { uploadImage } from '../firebase/uploadImage';

/**
 * Image upload component for profile pictures
 * @param {Object} props
 * @param {string} props.currentImage - Current image URL (if any)
 * @param {Function} props.onImageUploaded - Callback when image is uploaded successfully
 * @param {Function} props.onImageRemoved - Callback when image is removed
 */
function ImageUpload({ currentImage, onImageUploaded, onImageRemoved }) {
  const [image, setImage] = useState(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentImage || null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPEG, PNG, etc.)',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image size should be less than 5MB',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Start upload
    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file, (progress) => {
        setUploadProgress(progress);
      });
      
      setImage(imageUrl);
      setIsUploading(false);
      setUploadProgress(0);
      
      // Call the callback with the new image URL
      onImageUploaded(imageUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'Your profile image has been uploaded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      setUploadProgress(0);
      
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemoved();
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box width="100%">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <Flex direction="column" alignItems="center" justifyContent="center">
        {previewUrl ? (
          <Box position="relative" mb={4}>
            <Image
              src={previewUrl}
              alt="Profile preview"
              boxSize="150px"
              objectFit="cover"
              borderRadius="full"
              border="2px solid"
              borderColor="gray.200"
            />
            <IconButton
              aria-label="Remove image"
              icon={<span>×</span>}
              size="sm"
              colorScheme="red"
              position="absolute"
              top={0}
              right={0}
              borderRadius="full"
              onClick={handleRemoveImage}
              isDisabled={isUploading}
            />
          </Box>
        ) : (
          <Box
            width="150px"
            height="150px"
            borderRadius="full"
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={4}
            border="2px dashed"
            borderColor="gray.300"
          >
            <Text color="gray.500">No Image</Text>
          </Box>
        )}
        
        {isUploading && (
          <Box width="100%" maxW="300px" mb={4}>
            <Text mb={1} textAlign="center">Uploading: {Math.round(uploadProgress)}%</Text>
            <Progress value={uploadProgress} size="sm" colorScheme="teal" borderRadius="md" />
          </Box>
        )}
        
        <Button
          onClick={triggerFileInput}
          colorScheme="blue"
          size="sm"
          isLoading={isUploading}
          loadingText="Uploading..."
          mb={2}
        >
          {previewUrl ? 'Change Image' : 'Upload Image'}
        </Button>
        
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Supported formats: JPEG, PNG, GIF. Max size: 5MB
        </Text>
      </Flex>
    </Box>
  );
}

export default ImageUpload; 