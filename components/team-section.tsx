import Image from "next/image"

export default function TeamSection() {
  const team = [
    {
      name: "Alexander Wexler",
      role: "Founder & CEO",
      image: "/placeholder.svg?key=team-1",
      bio: "With over 20 years of experience in the luxury automotive industry, Alexander founded AutoWex with a vision to create an exceptional car buying experience.",
    },
    {
      name: "Sarah Johnson",
      role: "Sales Director",
      image: "/placeholder.svg?key=team-2",
      bio: "Sarah brings 15 years of expertise in luxury vehicle sales and customer relationship management, ensuring clients receive personalized attention.",
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image: "/placeholder.svg?key=team-3",
      bio: "Michael oversees all operational aspects of AutoWex, from inventory management to logistics, ensuring smooth and efficient processes.",
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      image: "/placeholder.svg?key=team-4",
      bio: "Emily leads our marketing initiatives, bringing innovative strategies to showcase our premium vehicles and services to discerning clients.",
    },
    {
      name: "David Kim",
      role: "Finance Director",
      image: "/placeholder.svg?key=team-5",
      bio: "David manages our financial services department, providing clients with tailored financing solutions for their luxury vehicle purchases.",
    },
    {
      name: "Olivia Thompson",
      role: "Customer Experience Manager",
      image: "/placeholder.svg?key=team-6",
      bio: "Olivia ensures every client interaction exceeds expectations, from the first showroom visit to long-term vehicle ownership.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {team.map((member) => (
        <div key={member.name} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-64">
            <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
            <p className="text-primary-600 font-medium mb-4">{member.role}</p>
            <p className="text-gray-600">{member.bio}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
