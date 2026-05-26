import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import hash from '@adonisjs/core/services/hash'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { HttpStatus } from '#enums/http_status'
import { MESSAGES } from '#constants/messages'

export default class ProfileController {
  async updateAvatar({ request, auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const avatarFile = request.file('avatar', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })

      // If a file was uploaded
      if (avatarFile) {
        if (!avatarFile.isValid) {
          return response.status(HttpStatus.BAD_REQUEST).json({
            message: avatarFile.errors[0]?.message || 'Invalid file uploaded',
          })
        }

        // Generate a random UUID filename to prevent guessing
        const filename = `${crypto.randomUUID()}.${avatarFile.extname}`
        const uploadPath = app.makePath('tmp/uploads/avatars')

        // Ensure directories exist
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true })
        }

        // Clean up old file if it was an uploaded avatar
        if (user.avatarUrl && user.avatarUrl.startsWith('/api/uploads/avatars/')) {
          const oldFilename = user.avatarUrl.replace('/api/uploads/avatars/', '')
          const oldFilePath = path.join(uploadPath, oldFilename)
          try {
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath)
            }
          } catch (err) {
            console.error('Failed to clean up old avatar file:', err)
          }
        }

        // Move to destination
        await avatarFile.move(uploadPath, {
          name: filename,
        })

        user.avatarUrl = `/api/uploads/avatars/${filename}`
      } else {
        // Check if updating avatarUrl directly via JSON body (e.g. string URL)
        const { avatarUrl } = request.only(['avatarUrl'])
        if (avatarUrl !== undefined) {
          user.avatarUrl = avatarUrl
        }
      }

      await user.save()

      return response.status(HttpStatus.OK).json({
        message: MESSAGES.USER.AVATAR_UPDATED,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
        },
      })
    } catch (error: any) {
      return response.status(HttpStatus.BAD_REQUEST).json({ message: error.message || 'Failed to update avatar' })
    }
  }

  async serveAvatar({ params, response }: HttpContext) {
    try {
      const filename = params.filename
      // Prevent path traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return response.status(HttpStatus.FORBIDDEN).json({ message: 'Access denied' })
      }

      const filePath = path.join(app.makePath('tmp/uploads/avatars'), filename)

      if (!fs.existsSync(filePath)) {
        return response.status(HttpStatus.NOT_FOUND).json({ message: 'Avatar not found' })
      }

      return response.download(filePath)
    } catch (error: any) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to serve avatar' })
    }
  }

  async changePassword({ request, auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const { currentPassword, newPassword } = request.only(['currentPassword', 'newPassword'])

      if (!newPassword || newPassword.length < 6) {
        return response.status(HttpStatus.BAD_REQUEST).json({ message: 'New password must be at least 6 characters long' })
      }

      // Check current password if the provider is email (or has a password)
      if (user.password) {
        if (!currentPassword) {
          return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Current password is required' })
        }
        const isMatched = await hash.verify(user.password, currentPassword)
        if (!isMatched) {
          return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Current password is incorrect' })
        }
      } else if (user.provider === 'google') {
        // Users authenticated with google do not have a password set.
        // We can let them set their password for the first time.
      }

      user.password = newPassword
      await user.save()

      return response.status(HttpStatus.OK).json({ message: MESSAGES.USER.PASSWORD_CHANGED })
    } catch (error: any) {
      return response.status(HttpStatus.BAD_REQUEST).json({ message: error.message || 'Failed to change password' })
    }
  }
}
