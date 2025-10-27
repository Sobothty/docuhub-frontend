# DocuHub Frontend ⚙️

## Overview 🌐

DocuHub is a comprehensive web platform designed to facilitate academic document management, collaboration, and mentorship. It serves as a centralized hub for students, advisers, and mentors to share, review, and access scholarly papers, proposals, and educational resources. The platform promotes knowledge sharing and academic growth through intuitive tools for document browsing, feedback exchange, and profile management.

## Features ✨

### For Students

- **Profile Management**: Create and update personal profiles with bio, contact information, and academic details.
- **Document Submission**: Upload and manage research papers, proposals, and assignments.
- **Mentorship Requests**: Connect with advisers and mentors for guidance.
- **Feedback System**: Receive and view feedback on submissions.
- **Favorites**: Bookmark important papers and resources for quick access.
- **Star Ratings**: Rate and review papers and mentors.

### For Advisers

- **Student Oversight**: Manage assigned students and their progress.
- **Document Review**: Review and provide feedback on student submissions.
- **Resource Sharing**: Share papers, guidelines, and educational materials.
- **Notifications**: Stay updated on student activities and submissions.

### For Public Users

- **Paper Browsing**: Access a vast repository of academic papers and resources.
- **Search and Filter**: Find documents by category, subject, or keyword.
- **User Profiles**: View profiles of authors, students, and advisers.
- **Request to Student**: Request to student with school card and school info

### General Features

- **Authentication**: Secure login and registration system.
- **Internationalization**: Support for English and Khmer languages.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **PDF Viewing and Editing**: Integrated PDF view for document reading and Editing.
- **Real-time Notifications**: Instant updates on activities.
- **Dashboard**: Personalized overview of activities and recommendations.

## Technologies Used ⚙️

- **Next.js 15**: React framework for server-side rendering and static site generation.
- **TypeScript**: Strongly typed programming for better code quality.
- **Redux Toolkit**: State management for complex application state.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Radix UI**: Accessible UI components.
- **Framer Motion**: Animation library for smooth interactions.
- **React Hook Form**: Form handling with validation.
- **Zod**: Schema validation.
- **PDF.js**: PDF rendering and manipulation.
- **i18next**: Internationalization framework.
- **NextAuth.js**: Authentication.
- **Recharts**: Data visualization.
- **Socket.io**: Real-time communication.

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone <url>
   cd foldername
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add necessary environment variables (API URLs, authentication secrets, etc.).

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

### Build for Production

```bash
npm run build
npm start
```

## API Integration 📡

The frontend integrates with a backend API for data management. Key API endpoints include:

- Authentication (login/register)
- User profiles
- Papers and documents
- Feedback and comments
- Notifications

## Localization 🌍

DocuHub supports multiple languages:

- English (`en`)
- Khmer (`kh`)

Translations are managed through `next-i18next` with JSON files in `public/locales/`.

## Contributing 🤝

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow ESLint configuration
- Write meaningful commit messages
- Test components and features thoroughly
- Maintain responsive design principles

## License 📄

Docuhub project is licensed under the ISTAD License.

## Acknowledgments 🙏

- ISTAD (Institute of Science and Technology Advanced Development)
- Open source community for the amazing tools and libraries
- Our mentors and contributors

## Contact 📧

For questions, support, or collaboration opportunities:

- Project Lead: But Seav Thong
- Email: tong24772@gmail.com
- GitHub: [ButSeavThong](https://github.com/ButSeavThong)

## Our Members 👥

Meet the talented individuals behind DocuHub. Our team is dedicated to creating a seamless platform for academic collaboration and knowledge sharing.

<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
<div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; width: 250px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <img src="/memberTeam/BUTSEAVTHONG.jpg" alt="But Seav Thong" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;">
  <h3 style="margin: 10px 0;">But Seav Thong</h3>
  <p style="color: #555;">Team Lead </p>
</div>
<div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; width: 250px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <img src="/memberTeam/krysobothty.jpg" alt="kry sobothty" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;">
  <h3 style="margin: 10px 0;">Kry Sobothty</h3>
  <p style="color: #555;">Full Stack</p>
</div>
<div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; width: 250px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <img src="/memberTeam/pengseangsim.jpg" alt="sim pengseang" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;">
  <h3 style="margin: 10px 0;">Sim PengSeang</h3>
  <p style="color: #555;">Full Stack</p>
</div>
<div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; width: 250px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <img src="/memberTeam/phohongleap.jpg" alt="pho hongleap" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;">
  <h3 style="margin: 10px 0;">Pho Hongleap</h3>
  <p style="color: #555;">Frontend / Representor</p>
</div>
<div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; width: 250px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <img src="/memberTeam/chimtheara.jpg" alt="chim theara" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;">
  <h3 style="margin: 10px 0;">Chim Theara</h3>
  <p style="color: #555;">UX/UI Lead / Frontend</p>
</div>
<div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; width: 250px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <img src="/memberTeam/sornsophamarinet.jpg" alt="Sorn Sophamarinet" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;">
  <h3 style="margin: 10px 0;">Sorn Sophamarinet</h3>
  <p style="color: #555;">Frontend</p>
</div>
<div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; width: 250px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <img src="/memberTeam/vannarithVr.jpg" alt="Vira Vannarith" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;">
  <h3 style="margin: 10px 0;">Vira Vannarith</h3>
  <p style="color: #555;">Backend</p>
</div>
<div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; width: 250px; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <img src="/memberTeam/khimsokha.jpg" alt="Khim Sokha" style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px;">
  <h3 style="margin: 10px 0;">Khim Sokha</h3>
  <p style="color: #555;">UX/UI</p>
</div>
</div>
