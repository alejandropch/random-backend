import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


export class DashboardController {

  static getUsers = async (req: Request, res: Response) => {
    const prisma = new PrismaClient()
    const { page = 1, pageSize = 10, search = '', sortField, sortOrder } = req.query;
    const skip = (Number(page) - 1) * Number(pageSize);

    let orderBy = {}
    if (sortField) {
      if (sortField == "nombreCompleto") {
        orderBy = { ["fullname"]: sortOrder === 'ascend' ? 'asc' : 'desc' }
      } else {
        orderBy = { [String(sortField)]: sortOrder === 'ascend' ? 'asc' : 'desc' }
      }
    }

    const where: any = search
      ? {
        OR: [
          { fullname: { contains: search } },
        ],
      }
      : {};

    const [records, total] = await prisma.$transaction([
      prisma.user.findMany({
        skip,
        take: Number(pageSize),
        where,
        orderBy,
      }),
      prisma.user.count({ where })
    ])
    
    res.json({ records, total });
  }

  static updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, fullname } = req.body;

    // Assuming `nombreCompleto` is a concatenation of fullname, apellidoPaterno, and apellidoMaterno

    const prisma = new PrismaClient()
    try {
      const userUpdated = await prisma.user.update({
        where: { id },
        data: {
          username,
          email,
          fullname,
        },
      });

      res.status(200).json({
        message: 'User updated',
        user: userUpdated,
      });
    } catch (error) {
      console.error('Error updating the user:', error);
      res.status(500).json({ error: 'Error updating the user' });
    }
  }
  static deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const prisma = new PrismaClient()

    try {
      await prisma.user.delete({
        where: { id },
      });
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      console.error('Error al eliminar user:', error);
      res.status(500).json({ error: 'Error when deleting the user' });
    }
  }

}