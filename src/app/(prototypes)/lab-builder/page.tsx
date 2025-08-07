'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/buttons/Button';
import { DashboardCard } from '@/components/cards/dashboard/DashboardCard';
import { TextField } from '@/components/inputs/TextField';
import { DropdownSelect } from '@/components/inputs/DropdownSelect';
import { Chip } from '@/components/info/Chip';
import { Alert } from '@/components/info/Alert';
import { Tabs } from '@/components/navigation/Tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon, Icons } from '@/components/Icon';
import { FilterControls } from '@/components/dashboard/FilterControls';

// Types
interface Activity {
  id: string;
  title: string;
  description: string;
  skill: string;
  technology: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  icon: keyof typeof Icons;
  aiGenerated?: boolean;
}

interface LeadData {
  name: string;
  email: string;
  company: string;
  companySize: string;
  useCase: string;
}

// Sample data
const technologies = [
  'Microsoft Azure', 'AWS', 'Google Cloud', 'Docker', 'Kubernetes', 
  'GitHub', 'GitLab', 'Jenkins', 'Terraform', 'Ansible', 'Python', 
  'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'Redis', 'TypeScript',
  'Vue.js', 'Angular', 'Express.js', 'Django', 'Flask', 'Spring Boot',
  'PostgreSQL', 'MySQL', 'Elasticsearch', 'RabbitMQ', 'Apache Kafka',
  'Prometheus', 'Grafana', 'Istio', 'Helm', 'ArgoCD', 'Selenium',
  'Jest', 'Cypress', 'JUnit', 'PyTest', 'Maven', 'Gradle', 'npm',
  'Yarn', 'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier', 'HashiCorp Vault'
];

const topics = [
  'Cloud Infrastructure', 'Software Development', 'Cybersecurity', 
  'AI & Machine Learning', 'DevOps', 'Data Science', 'Web Development',
  'Mobile Development', 'Database Management', 'Networking', 'Testing',
  'Monitoring', 'Security', 'API Development', 'Microservices'
];

const companySizes = [
  '1-10 employees', '11-50 employees', '51-200 employees', 
  '201-1000 employees', '1000+ employees'
];

const useCases = [
  'Employee Training', 'Skill Assessment', 'Certification Prep', 
  'Onboarding', 'Continuous Learning', 'Technical Evaluation'
];

const sampleActivities: Activity[] = [
  // Cloud Infrastructure Activities
  {
    id: '1',
    title: 'Create Azure Resource Group',
    description: 'Set up a new resource group in Azure with proper naming conventions and tags.',
    skill: 'Azure Resource Management',
    technology: 'Microsoft Azure',
    topic: 'Cloud Infrastructure',
    difficulty: 'Beginner',
    duration: '5 minutes',
    icon: 'cloud'
  },
  {
    id: '2',
    title: 'Deploy Azure Virtual Network',
    description: 'Create a virtual network with subnets for web, app, and database tiers.',
    skill: 'Azure Networking',
    technology: 'Microsoft Azure',
    topic: 'Cloud Infrastructure',
    difficulty: 'Beginner',
    duration: '8 minutes',
    icon: 'cloud'
  },
  {
    id: '3',
    title: 'Configure Azure Security Groups',
    description: 'Set up network security groups with appropriate inbound and outbound rules.',
    skill: 'Azure Security',
    technology: 'Microsoft Azure',
    topic: 'Cloud Infrastructure',
    difficulty: 'Intermediate',
    duration: '6 minutes',
    icon: 'security'
  },
  {
    id: '4',
    title: 'Create AWS S3 Bucket',
    description: 'Set up an S3 bucket with proper permissions and versioning enabled.',
    skill: 'AWS Storage',
    technology: 'AWS',
    topic: 'Cloud Infrastructure',
    difficulty: 'Beginner',
    duration: '4 minutes',
    icon: 'cloud'
  },
  {
    id: '5',
    title: 'Deploy EC2 Instance',
    description: 'Launch an EC2 instance with the appropriate instance type and security groups.',
    skill: 'AWS Compute',
    technology: 'AWS',
    topic: 'Cloud Infrastructure',
    difficulty: 'Beginner',
    duration: '7 minutes',
    icon: 'server'
  },
  {
    id: '6',
    title: 'Set Up AWS Lambda Function',
    description: 'Create a serverless Lambda function with basic event triggers.',
    skill: 'AWS Serverless',
    technology: 'AWS',
    topic: 'Cloud Infrastructure',
    difficulty: 'Intermediate',
    duration: '10 minutes',
    icon: 'zap'
  },
  {
    id: '7',
    title: 'Create GCP Project',
    description: 'Set up a new Google Cloud project with billing and IAM configuration.',
    skill: 'GCP Project Management',
    technology: 'Google Cloud',
    topic: 'Cloud Infrastructure',
    difficulty: 'Beginner',
    duration: '5 minutes',
    icon: 'cloud'
  },
  {
    id: '8',
    title: 'Deploy GCP Compute Engine',
    description: 'Launch a Compute Engine instance with custom machine type and startup script.',
    skill: 'GCP Compute',
    technology: 'Google Cloud',
    topic: 'Cloud Infrastructure',
    difficulty: 'Intermediate',
    duration: '8 minutes',
    icon: 'server'
  },
  // Container & Orchestration Activities
  {
    id: '9',
    title: 'Build Docker Image',
    description: 'Create a Dockerfile and build a container image for a simple web application.',
    skill: 'Docker Image Building',
    technology: 'Docker',
    topic: 'DevOps',
    difficulty: 'Beginner',
    duration: '6 minutes',
    icon: 'server'
  },
  {
    id: '10',
    title: 'Run Docker Container',
    description: 'Start and manage a Docker container with volume mounts and port mapping.',
    skill: 'Docker Container Management',
    technology: 'Docker',
    topic: 'DevOps',
    difficulty: 'Beginner',
    duration: '4 minutes',
    icon: 'server'
  },
  {
    id: '11',
    title: 'Create Docker Compose File',
    description: 'Set up a multi-service application using Docker Compose with networking.',
    skill: 'Docker Orchestration',
    technology: 'Docker',
    topic: 'DevOps',
    difficulty: 'Intermediate',
    duration: '8 minutes',
    icon: 'layers'
  },
  {
    id: '12',
    title: 'Deploy Kubernetes Pod',
    description: 'Create and deploy a simple pod with resource limits and health checks.',
    skill: 'Kubernetes Pod Management',
    technology: 'Kubernetes',
    topic: 'DevOps',
    difficulty: 'Intermediate',
    duration: '7 minutes',
    icon: 'layers'
  },
  {
    id: '13',
    title: 'Create Kubernetes Service',
    description: 'Set up a service to expose your application within the cluster.',
    skill: 'Kubernetes Networking',
    technology: 'Kubernetes',
    topic: 'DevOps',
    difficulty: 'Intermediate',
    duration: '5 minutes',
    icon: 'layers'
  },
  {
    id: '14',
    title: 'Deploy Kubernetes Deployment',
    description: 'Create a deployment with replica sets and rolling update strategy.',
    skill: 'Kubernetes Deployments',
    technology: 'Kubernetes',
    topic: 'DevOps',
    difficulty: 'Advanced',
    duration: '10 minutes',
    icon: 'layers'
  },
  // Web Development Activities
  {
    id: '15',
    title: 'Create React Component',
    description: 'Build a reusable React component with props and state management.',
    skill: 'React Component Development',
    technology: 'React',
    topic: 'Web Development',
    difficulty: 'Beginner',
    duration: '6 minutes',
    icon: 'code'
  },
  {
    id: '16',
    title: 'Set Up React Hooks',
    description: 'Implement useState and useEffect hooks for state and side effects.',
    skill: 'React Hooks',
    technology: 'React',
    topic: 'Web Development',
    difficulty: 'Intermediate',
    duration: '8 minutes',
    icon: 'code'
  },
  {
    id: '17',
    title: 'Create React Router Setup',
    description: 'Configure client-side routing with React Router and navigation guards.',
    skill: 'React Routing',
    technology: 'React',
    topic: 'Web Development',
    difficulty: 'Intermediate',
    duration: '7 minutes',
    icon: 'code'
  },
  {
    id: '18',
    title: 'Build Vue.js Component',
    description: 'Create a Vue component with template, script, and style sections.',
    skill: 'Vue.js Development',
    technology: 'Vue.js',
    topic: 'Web Development',
    difficulty: 'Beginner',
    duration: '5 minutes',
    icon: 'code'
  },
  {
    id: '19',
    title: 'Set Up Angular Service',
    description: 'Create an Angular service for data management and API communication.',
    skill: 'Angular Services',
    technology: 'Angular',
    topic: 'Web Development',
    difficulty: 'Intermediate',
    duration: '8 minutes',
    icon: 'code'
  },
  {
    id: '20',
    title: 'Create Express.js Route',
    description: 'Set up RESTful API routes with middleware and error handling.',
    skill: 'Express.js API Development',
    technology: 'Express.js',
    topic: 'Web Development',
    difficulty: 'Intermediate',
    duration: '6 minutes',
    icon: 'code'
  },
  // Backend Development Activities
  {
    id: '21',
    title: 'Create Python Flask Route',
    description: 'Set up a Flask application with basic routing and template rendering.',
    skill: 'Flask Development',
    technology: 'Flask',
    topic: 'Software Development',
    difficulty: 'Beginner',
    duration: '5 minutes',
    icon: 'code'
  },
  {
    id: '22',
    title: 'Build Django Model',
    description: 'Create Django models with relationships and database migrations.',
    skill: 'Django ORM',
    technology: 'Django',
    topic: 'Software Development',
    difficulty: 'Intermediate',
    duration: '7 minutes',
    icon: 'database'
  },
  {
    id: '23',
    title: 'Create Spring Boot Controller',
    description: 'Set up a REST controller with request mapping and response handling.',
    skill: 'Spring Boot Controllers',
    technology: 'Spring Boot',
    topic: 'Software Development',
    difficulty: 'Intermediate',
    duration: '8 minutes',
    icon: 'code'
  },
  {
    id: '24',
    title: 'Set Up Node.js Server',
    description: 'Create a basic HTTP server with request handling and middleware.',
    skill: 'Node.js Server Development',
    technology: 'Node.js',
    topic: 'Software Development',
    difficulty: 'Beginner',
    duration: '6 minutes',
    icon: 'server'
  },
  // Database Activities
  {
    id: '25',
    title: 'Create SQL Table',
    description: 'Design and create database tables with proper constraints and indexes.',
    skill: 'SQL Schema Design',
    technology: 'SQL',
    topic: 'Database Management',
    difficulty: 'Beginner',
    duration: '5 minutes',
    icon: 'database'
  },
  {
    id: '26',
    title: 'Write SQL Queries',
    description: 'Write SELECT, INSERT, UPDATE, and DELETE queries with JOINs.',
    skill: 'SQL Query Writing',
    technology: 'SQL',
    topic: 'Database Management',
    difficulty: 'Intermediate',
    duration: '8 minutes',
    icon: 'database'
  },
  {
    id: '27',
    title: 'Set Up MongoDB Collection',
    description: 'Create MongoDB collections with proper indexing and validation.',
    skill: 'MongoDB Schema Design',
    technology: 'MongoDB',
    topic: 'Database Management',
    difficulty: 'Intermediate',
    duration: '6 minutes',
    icon: 'database'
  },
  {
    id: '28',
    title: 'Create PostgreSQL Database',
    description: 'Set up a PostgreSQL database with user permissions and extensions.',
    skill: 'PostgreSQL Administration',
    technology: 'PostgreSQL',
    topic: 'Database Management',
    difficulty: 'Intermediate',
    duration: '7 minutes',
    icon: 'database'
  },
  // DevOps Activities
  {
    id: '29',
    title: 'Create GitHub Repository',
    description: 'Set up a new Git repository with README and .gitignore files.',
    skill: 'Git Repository Management',
    technology: 'GitHub',
    topic: 'DevOps',
    difficulty: 'Beginner',
    duration: '3 minutes',
    icon: 'code'
  },
  {
    id: '30',
    title: 'Set Up Git Branching',
    description: 'Create feature branches and implement Git flow workflow.',
    skill: 'Git Branching Strategy',
    technology: 'GitHub',
    topic: 'DevOps',
    difficulty: 'Intermediate',
    duration: '6 minutes',
    icon: 'code'
  },
  {
    id: '31',
    title: 'Create GitHub Actions Workflow',
    description: 'Set up CI/CD pipeline with automated testing and deployment.',
    skill: 'GitHub Actions',
    technology: 'GitHub',
    topic: 'DevOps',
    difficulty: 'Intermediate',
    duration: '10 minutes',
    icon: 'refresh'
  },
  {
    id: '32',
    title: 'Configure Jenkins Pipeline',
    description: 'Create a Jenkins declarative pipeline with stages and post actions.',
    skill: 'Jenkins Pipeline',
    technology: 'Jenkins',
    topic: 'DevOps',
    difficulty: 'Advanced',
    duration: '10 minutes',
    icon: 'refresh'
  },
  {
    id: '33',
    title: 'Write Terraform Configuration',
    description: 'Create infrastructure as code with Terraform for cloud resources.',
    skill: 'Terraform IaC',
    technology: 'Terraform',
    topic: 'DevOps',
    difficulty: 'Intermediate',
    duration: '8 minutes',
    icon: 'code'
  },
  {
    id: '34',
    title: 'Create Ansible Playbook',
    description: 'Write an Ansible playbook for server configuration and deployment.',
    skill: 'Ansible Automation',
    technology: 'Ansible',
    topic: 'DevOps',
    difficulty: 'Intermediate',
    duration: '9 minutes',
    icon: 'refresh'
  },
  // Security Activities
  {
    id: '35',
    title: 'Configure SSL Certificate',
    description: 'Set up SSL/TLS certificates for secure HTTPS communication.',
    skill: 'SSL/TLS Configuration',
    technology: 'Security Tools',
    topic: 'Cybersecurity',
    difficulty: 'Intermediate',
    duration: '7 minutes',
    icon: 'security'
  },
  {
    id: '36',
    title: 'Set Up Firewall Rules',
    description: 'Configure firewall rules for network security and access control.',
    skill: 'Network Security',
    technology: 'Security Tools',
    topic: 'Cybersecurity',
    difficulty: 'Intermediate',
    duration: '6 minutes',
    icon: 'security'
  },
  {
    id: '37',
    title: 'Implement Authentication',
    description: 'Set up user authentication with JWT tokens and password hashing.',
    skill: 'Application Security',
    technology: 'Security Tools',
    topic: 'Cybersecurity',
    difficulty: 'Advanced',
    duration: '10 minutes',
    icon: 'security'
  },
  {
    id: '38',
    title: 'Configure RBAC',
    description: 'Set up role-based access control for application permissions.',
    skill: 'Access Control',
    technology: 'Security Tools',
    topic: 'Cybersecurity',
    difficulty: 'Advanced',
    duration: '8 minutes',
    icon: 'security'
  },
  // Testing Activities
  {
    id: '39',
    title: 'Write Unit Tests',
    description: 'Create unit tests using Jest for JavaScript functions and components.',
    skill: 'Unit Testing',
    technology: 'Jest',
    topic: 'Testing',
    difficulty: 'Beginner',
    duration: '6 minutes',
    icon: 'code'
  },
  {
    id: '40',
    title: 'Set Up Integration Tests',
    description: 'Create integration tests for API endpoints and database operations.',
    skill: 'Integration Testing',
    technology: 'Jest',
    topic: 'Testing',
    difficulty: 'Intermediate',
    duration: '8 minutes',
    icon: 'code'
  },
  {
    id: '41',
    title: 'Create E2E Tests',
    description: 'Set up end-to-end tests using Cypress for web application flows.',
    skill: 'End-to-End Testing',
    technology: 'Cypress',
    topic: 'Testing',
    difficulty: 'Intermediate',
    duration: '9 minutes',
    icon: 'code'
  },
  {
    id: '42',
    title: 'Write Python Tests',
    description: 'Create unit tests using PyTest for Python functions and classes.',
    skill: 'Python Testing',
    technology: 'PyTest',
    topic: 'Testing',
    difficulty: 'Beginner',
    duration: '5 minutes',
    icon: 'code'
  },
  // Monitoring Activities
  {
    id: '43',
    title: 'Set Up Prometheus Metrics',
    description: 'Configure Prometheus to collect and store application metrics.',
    skill: 'Metrics Collection',
    technology: 'Prometheus',
    topic: 'Monitoring',
    difficulty: 'Intermediate',
    duration: '8 minutes',
    icon: 'monitor'
  },
  {
    id: '44',
    title: 'Create Grafana Dashboard',
    description: 'Build a Grafana dashboard to visualize application metrics and logs.',
    skill: 'Data Visualization',
    technology: 'Grafana',
    topic: 'Monitoring',
    difficulty: 'Intermediate',
    duration: '7 minutes',
    icon: 'monitor'
  },
  {
    id: '45',
    title: 'Configure Log Aggregation',
    description: 'Set up centralized logging with ELK stack or similar tools.',
    skill: 'Log Management',
    technology: 'Elasticsearch',
    topic: 'Monitoring',
    difficulty: 'Advanced',
    duration: '10 minutes',
    icon: 'monitor'
  },
  // AI/ML Activities
  {
    id: '46',
    title: 'Train Simple ML Model',
    description: 'Create and train a basic machine learning model using scikit-learn.',
    skill: 'Machine Learning Basics',
    technology: 'Python',
    topic: 'AI & Machine Learning',
    difficulty: 'Intermediate',
    duration: '10 minutes',
    icon: 'ai'
  },
  {
    id: '47',
    title: 'Deploy ML Model API',
    description: 'Create a REST API to serve machine learning model predictions.',
    skill: 'ML Model Deployment',
    technology: 'Python',
    topic: 'AI & Machine Learning',
    difficulty: 'Advanced',
    duration: '9 minutes',
    icon: 'ai'
  },
  {
    id: '48',
    title: 'Set Up Data Pipeline',
    description: 'Create a data pipeline for preprocessing and feature engineering.',
    skill: 'Data Engineering',
    technology: 'Python',
    topic: 'Data Science',
    difficulty: 'Advanced',
    duration: '10 minutes',
    icon: 'database'
  },
  {
    id: '49',
    title: 'Create Data Visualization',
    description: 'Build interactive data visualizations using matplotlib and seaborn.',
    skill: 'Data Visualization',
    technology: 'Python',
    topic: 'Data Science',
    difficulty: 'Intermediate',
    duration: '7 minutes',
    icon: 'monitor'
  },
  {
    id: '50',
    title: 'Implement API Gateway',
    description: 'Set up an API gateway for microservices with routing and rate limiting.',
    skill: 'API Gateway Configuration',
    technology: 'Istio',
    topic: 'Microservices',
    difficulty: 'Advanced',
    duration: '10 minutes',
    icon: 'server'
  }
];

// Components
const ActivityCard: React.FC<{
  activity: Activity;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onEdit?: () => void;
}> = React.memo(({ activity, isDragging, onDragStart, onEdit }) => {
  const IconComponent = Icons[activity.icon];

  return (
    <div
      className={`
        relative bg-white border border-gray-200 rounded-lg p-4 cursor-move
        transition-all duration-200 hover:shadow-md hover:border-primary-main
        ${isDragging ? 'opacity-50 scale-95' : ''}
      `}
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon icon={Icons.dragHandle} className="text-gray-400 w-4 h-4" />
          <Icon icon={IconComponent} className="text-primary-main w-5 h-5" />
          <h3 className="font-semibold text-gray-900">{activity.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {activity.aiGenerated && (
            <Icon icon={Icons.sparkles} className="text-blue-500 w-4 h-4" />
          )}
          <Button
            variant="icon"
            size="small"
            leftIcon="edit"
            onClick={onEdit}
            tooltip="Edit Activity"
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <Chip variant="default" size="small">
          {activity.skill}
        </Chip>
        <Chip variant="secondary" size="small">
          {activity.technology}
        </Chip>
        <Chip variant="default" size="small">
          {activity.topic}
        </Chip>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Icon icon={Icons.clock} className="w-3 h-3" />
          {activity.duration}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          activity.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
          activity.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {activity.difficulty}
        </span>
      </div>
    </div>
  );
});

ActivityCard.displayName = 'ActivityCard';

const LeadCaptureForm: React.FC<{
  onSubmit: (data: LeadData) => void;
  isLoading?: boolean;
}> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    email: '',
    company: '',
    companySize: '',
    useCase: ''
  });
  const [errors, setErrors] = useState<Partial<LeadData>>({});

  const validateForm = useCallback(() => {
    const newErrors: Partial<LeadData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.companySize) newErrors.companySize = 'Company size is required';
    if (!formData.useCase) newErrors.useCase = 'Use case is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  }, [formData, validateForm, onSubmit]);

  const handleInputChange = useCallback((field: keyof LeadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <Icon icon={Icons.lab} className="w-12 h-12 text-primary-main mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Your Lab</h2>
        <p className="text-gray-600">
          Complete the form below to preview your custom lab experience
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <TextField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </div>
        
        <TextField
          label="Company"
          value={formData.company}
          onChange={(e) => handleInputChange('company', e.target.value)}
          error={!!errors.company}
          helperText={errors.company}
          required
        />
        
        <DropdownSelect
          label="Company Size"
          options={companySizes.map(size => ({ value: size, label: size }))}
          value={formData.companySize}
          onChange={(e) => handleInputChange('companySize', e.target.value)}
          error={!!errors.companySize}
          helperText={errors.companySize}
          required
        />
        
        <DropdownSelect
          label="Primary Use Case"
          options={useCases.map(useCase => ({ value: useCase, label: useCase }))}
          value={formData.useCase}
          onChange={(e) => handleInputChange('useCase', e.target.value)}
          error={!!errors.useCase}
          helperText={errors.useCase}
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          size="large"
          leftIcon="eye"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Preview My Lab'}
        </Button>
      </form>
    </div>
  );
};

const LabPreview: React.FC<{
  activities: Activity[];
  leadData: LeadData;
}> = ({ activities, leadData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartLab = useCallback(() => {
    setIsLoading(true);
    // Simulate lab loading
    setTimeout(() => {
      setIsLoading(false);
      // In a real implementation, this would redirect to the actual lab
      alert('Lab environment is ready! This would launch your interactive lab experience.');
    }, 2000);
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <Icon icon={Icons.award} className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Lab is Ready!</h2>
        <p className="text-gray-600 mb-4">
          Welcome, {leadData.name}! Your custom lab experience has been created.
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Lab Overview</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Activities:</span>
              <div className="font-semibold">{activities.length}</div>
            </div>
            <div>
              <span className="text-gray-500">Total Duration:</span>
              <div className="font-semibold">
                {activities.reduce((total, activity) => {
                  const minutes = parseInt(activity.duration);
                  return total + (isNaN(minutes) ? 0 : minutes);
                }, 0)} minutes
              </div>
            </div>
            <div>
              <span className="text-gray-500">Technologies:</span>
              <div className="font-semibold">
                {new Set(activities.map(a => a.technology)).size}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Difficulty:</span>
              <div className="font-semibold">
                {activities.some(a => a.difficulty === 'Advanced') ? 'Advanced' :
                 activities.some(a => a.difficulty === 'Intermediate') ? 'Intermediate' : 'Beginner'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Activities Included</h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-main text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.duration} • {activity.difficulty}</p>
              </div>
              <Icon icon={Icons[activity.icon]} className="w-5 h-5 text-primary-main" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="primary"
          size="large"
          leftIcon="play"
          onClick={handleStartLab}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Launching Lab...
            </>
          ) : (
            'Launch Lab Environment'
          )}
        </Button>
        <Button
          variant="outline"
          size="large"
          leftIcon="share"
          onClick={() => alert('Share functionality would be implemented here')}
        >
          Share
        </Button>
      </div>
    </div>
  );
};

// Main Component
export default function LabBuilderPage() {
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'build' | 'capture' | 'preview'>('build');
  const [filters, setFilters] = useState<Array<{ column: string; operator: string; value: unknown }>>([]);
  const [labName, setLabName] = useState<string>('');

  // Filter configuration
  const filterColumns = useMemo(() => [
    {
      label: 'Skill',
      value: 'skill',
      type: 'select' as const,
      options: Array.from(new Set(sampleActivities.map(a => a.skill))).map(skill => ({
        label: skill,
        value: skill
      }))
    },
    {
      label: 'Difficulty',
      value: 'difficulty',
      type: 'select' as const,
      options: [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' }
      ]
    },
    {
      label: 'Topic',
      value: 'topic',
      type: 'select' as const,
      options: Array.from(new Set(sampleActivities.map(a => a.topic))).map(topic => ({
        label: topic,
        value: topic
      }))
    }
  ], []);

  const operatorsByType = useMemo(() => ({
    select: [
      { label: 'Equals', value: 'equals' },
      { label: 'Not equals', value: 'not_equals' },
      { label: 'In', value: 'in' },
      { label: 'Not in', value: 'not_in' }
    ]
  }), []);

  // Filter activities based on current filters
  const filteredActivities = useMemo(() => {
    return sampleActivities.filter(activity => {
      return filters.every(filter => {
        const activityValue = activity[filter.column as keyof Activity];
        
        switch (filter.operator) {
          case 'equals':
            return activityValue === filter.value;
          case 'not_equals':
            return activityValue !== filter.value;
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(activityValue);
          case 'not_in':
            return Array.isArray(filter.value) && !filter.value.includes(activityValue);
          default:
            return true;
        }
      });
    });
  }, [filters]);

  const handleDragStart = useCallback((e: React.DragEvent, activity: Activity) => {
    e.dataTransfer.setData('application/json', JSON.stringify(activity));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const activityData = e.dataTransfer.getData('application/json');
    if (activityData) {
      const activity: Activity = JSON.parse(activityData);
      if (!selectedActivities.find(a => a.id === activity.id)) {
        setSelectedActivities(prev => [...prev, activity]);
      }
    }
  }, [selectedActivities]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleRemoveActivity = useCallback((activityId: string) => {
    setSelectedActivities(prev => prev.filter(a => a.id !== activityId));
  }, []);

  const handleLeadSubmit = useCallback(async (data: LeadData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLeadData(data);
    setCurrentStep('preview');
    setIsSubmitting(false);
  }, []);

  const handleEditActivity = useCallback((activity: Activity) => {
    alert(`Edit functionality for "${activity.title}" would be implemented here`);
  }, []);

  const handleNextStep = useCallback(() => {
    if (selectedActivities.length === 0) {
      alert('Please add at least one activity to your lab before proceeding.');
      return;
    }
    setCurrentStep('capture');
  }, [selectedActivities.length]);



  const renderBuildStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Activity Bank */}
      <div className="lg:col-span-1 flex flex-col h-screen">
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Activity Bank</h2>
            <Button
              variant="outline"
              size="small"
              leftIcon="sparkles"
              onClick={() => alert('AI generation would be implemented here')}
            >
              Generate with AI
            </Button>
          </div>
          
          <div className="mb-4">
            <FilterControls
              columns={filterColumns}
              filters={filters}
              onFiltersChange={setFilters}
              operatorsByType={operatorsByType}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 overflow-y-auto flex-1">
            {filteredActivities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onDragStart={(e) => handleDragStart(e, activity)}
                onEdit={() => handleEditActivity(activity)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lab Canvas */}
      <div className="lg:col-span-2">
        <div
          className={`
            bg-white rounded-lg border-2 border-dashed p-6 min-h-[400px]
            transition-colors duration-200
            ${selectedActivities.length === 0 
              ? 'border-gray-300 bg-gray-50' 
              : 'border-primary-main bg-primary-contrast'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="text-center mb-4">
            <Icon 
              icon={Icons.lab} 
              className={`w-8 h-8 mx-auto mb-2 ${
                selectedActivities.length === 0 ? 'text-gray-400' : 'text-primary-main'
              }`} 
            />
            <div className="mb-3">
              <TextField
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                placeholder="Enter your lab name..."
                className="text-center font-semibold text-gray-900 text-lg"
              />
            </div>
            {selectedActivities.length > 0 && (
              <p className="text-sm text-gray-600">
                {selectedActivities.length} activities selected
              </p>
            )}
          </div>

          {selectedActivities.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No Activities Added"
              message="Start building your lab by dragging activities from the bank"
            />
          ) : (
            <div className="space-y-3">
              {selectedActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="w-6 h-6 bg-primary-main text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-gray-600">{activity.duration}</p>
                  </div>
                  <Button
                    variant="icon"
                    size="small"
                    leftIcon="delete"
                    onClick={() => handleRemoveActivity(activity.id)}
                    tooltip="Remove Activity"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Step Button */}
        <div className="mt-6 text-center">
          <Button
            variant="primary"
            size="large"
            leftIcon="chevronRight"
            onClick={handleNextStep}
            disabled={selectedActivities.length === 0}
            className="w-full"
          >
            Continue to Info Capture ({selectedActivities.length} activities)
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCaptureStep = () => (
    <div className="max-w-2xl mx-auto">
      <LeadCaptureForm onSubmit={handleLeadSubmit} isLoading={isSubmitting} />
    </div>
  );

  const renderPreviewStep = () => (
    <div className="max-w-4xl mx-auto">
      <LabPreview activities={selectedActivities} leadData={leadData!} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Icon icon={Icons.lab} className="w-8 h-8 text-primary-main" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Skillable Lab Builder</h1>
                <p className="text-sm text-gray-600">Create interactive technical labs</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="small"
                leftIcon="circleQuestionMark"
                onClick={() => alert('Help documentation would be available here')}
              >
                Help
              </Button>
              <Button
                variant="primary"
                size="small"
                leftIcon="externalLink"
                onClick={() => window.open('https://skillable.com', '_blank')}
              >
                Visit Skillable
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'build' && renderBuildStep()}
        {currentStep === 'capture' && renderCaptureStep()}
        {currentStep === 'preview' && renderPreviewStep()}
      </div>
    </div>
  );
} 