import bcrypt from "bcrypt";
import { UserRole, UserStatus } from "@prisma/client";
import config from "./app/config";
import prisma from "./app/shared/prisma";

const superAdminData = {
	name: config.super_admin_name as string,
	email: config.super_admin_email_address as string,
	password: config.super_admin_password as string,
	role: UserRole.SUPER_ADMIN,
	status: UserStatus.ACTIVE,
};

const superAdminProfileData = {
	bio: "Exploring the world one trip at a time. Join me on Travel Buddy for unforgettable adventures and travel tips.",
	age: 25,
};

const seedSuperAdmin = async () => {
	superAdminData.password = await bcrypt.hash(
		superAdminData.password,
		Number(config.bcrypt_salt_round)
	);
	try {
		const isSuperAdminExist = await prisma.user.findFirst({
			where: {
				email: superAdminData.email,
				role: UserRole.SUPER_ADMIN,
			},
		});

		if (isSuperAdminExist) {
			console.log(
				`A super admin with email ${superAdminData.email} already exists!`
			);
		}

		if (!isSuperAdminExist) {
			const superAdmin = await prisma.user.create({
				data: {
					...superAdminData,
					userProfile: {
						create: superAdminProfileData,
					},
				},
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
					status: true,
				},
			});

			console.log("Super Admin created successfully!");
			console.log(superAdmin);
		}
	} catch (err) {
		console.log(err);
	} finally {
		prisma.$disconnect();
	}
};

seedSuperAdmin();
