const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding permissions system...');
  
  const churchId = 'demo-church';
  
  // Create Administrador de Iglesia role
  const adminRole = await prisma.role.upsert({
    where: { 
      name_churchId: { 
        name: 'Administrador de Iglesia', 
        churchId 
      } 
    },
    update: {},
    create: {
      name: 'Administrador de Iglesia',
      description: 'Gestión completa de la iglesia y usuarios',
      churchId,
      priority: 80
    }
  });
  
  console.log('✅ Created/found admin role:', adminRole.name);
  
  // Define all resources and actions
  const resources = [
    'members', 'volunteers', 'donations', 'events', 'sermons', 
    'communications', 'analytics', 'settings', 'reports', 
    'social_media', 'marketing', 'website_builder', 'automation'
  ];
  
  const actions = ['read', 'create', 'update', 'delete'];
  
  let permissionCount = 0;
  
  // Create permissions for all combinations
  for (const resource of resources) {
    for (const action of actions) {
      const permission = await prisma.permission.upsert({
        where: {
          resource_action: {
            resource,
            action
          }
        },
        update: {},
        create: {
          name: `${resource}:${action}`,
          resource,
          action,
          description: `${action} access to ${resource}`
        }
      });
      
      // Assign to admin role
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      });
      
      permissionCount++;
    }
  }
  
  console.log(`✅ Created/updated ${permissionCount} permissions`);
  console.log('✅ All permissions assigned to Administrador de Iglesia role');
  
  // Verify
  const roleWithPerms = await prisma.role.findUnique({
    where: { id: adminRole.id },
    include: {
      rolePermissions: {
        include: {
          permission: true
        }
      }
    }
  });
  
  console.log(`\n📊 Total permissions for ${roleWithPerms.name}: ${roleWithPerms.rolePermissions.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
