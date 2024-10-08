import { ChannelType, DiscordAPIError } from "discord.js"
import type { Guild as DiscordClient } from "discord.js"
import { PrismaClient } from "@prisma/client"
import type { Category } from "@prisma/client"

export class CategoryClient {
  client: PrismaClient
  constructor(client = new PrismaClient()) {
    this.client = client
  }

  /**
   * Deploy all category
   * @param discordClient
   */
  async deployAllCategory(discordClient: DiscordClient) {
    // Get all category data
    const categories = await this.getAllCategory()

    // Create all category
    const newCategories: Category[] = await Promise.all(
      categories.map(async (category) => {
        const newCategory = await discordClient.channels.create({
          name: category.name,
          type: ChannelType.GuildCategory,
        })

        return {
          id: category.id,
          deployId: newCategory.id,
          name: newCategory.name,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })
    )

    // Update all category data
    await this.updateManyCategory(newCategories)
  }

  /**
   * Destroy all category
   */
  async destroyAllCategory(discordClient: DiscordClient) {
    const categories = await this.getAllCategory(true)
    const newCategories = await Promise.all(
      categories.map(async (category) => {
        try {
          if (!category.deployId)
            throw new Error("Failed to get is deployed category id")
          await discordClient.channels.delete(category.deployId)
        } catch (error) {
          if (error instanceof DiscordAPIError && error.code == 10003) {
            // Do not throw error if category to be deleted does not exist
          } else {
            throw error
          }
        }

        const newCategory = (() => category)()
        newCategory.deployId

        return newCategory
      })
    )
    await this.updateManyCategory(newCategories)

    // await this.client.category.deleteMany({
    //   where: {
    //     deployId: {
    //       not: {
    //         equals: null,
    //       },
    //     },
    //   },
    // })
  }

  /**
   * Update many category
   * @param categories
   */
  async updateManyCategory(categories: Category[]) {
    const query = categories.map((category) =>
      this.client.category.upsert({
        where: {
          id: category.id,
        },
        update: {
          deployId: category.deployId,
          name: category.name,
        },
        create: {
          id: category.id,
          deployId: category.deployId,
          name: category.name,
        },
      })
    )
    await this.client.$transaction([...query])
  }

  /**
   * Get single category data
   * @param categoryId
   */
  async getCategory(categoryId: string, isDeployed: boolean = false) {
    return await this.client.category.findFirst({
      where: {
        id: categoryId,
        deployId: isDeployed ? { not: { equals: null } } : undefined,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    })
  }

  /**
   * Get all category data
   * @param isDeployed
   */
  async getAllCategory(isDeployed: boolean = false) {
    return await this.client.category.findMany({
      where: {
        deployId: isDeployed ? { not: { equals: null } } : undefined,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    })
  }
}
