import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { getModelToken } from '@nestjs/mongoose';
import { Group } from './schemas/group.schema';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/schemas/user.schema';
import { UpsertGroupDto } from './dto/upsert-group.dto';
import * as mongoose from 'mongoose';

// Mock GroupModel
const mockGroupModel = {
    findOneAndUpdate: jest.fn(),
};

// Mock AuthService
const mockAuthService = {};

describe('GroupsService', () => {
    let service: GroupsService;
    let model: Model<Group>;

    const mockUserId = new mongoose.Types.ObjectId();
    const mockUser: User = {
        _id: mockUserId,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password',
        createdAt: new Date(),
    } as User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GroupsService,
                {
                    provide: getModelToken(Group.name),
                    useValue: mockGroupModel,
                },
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        service = module.get<GroupsService>(GroupsService);
        model = module.get<Model<Group>>(getModelToken(Group.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('upsertGroup', () => {
        it('should create a new group if one with the same name and owner does not exist', async () => {
            const upsertGroupDto: UpsertGroupDto = {
                name: 'New Group',
                description: 'A new group for testing',
                icon: 'icon-url',
            };

            const expectedGroup = {
                _id: new mongoose.Types.ObjectId(),
                name: upsertGroupDto.name,
                description: upsertGroupDto.description,
                icon: upsertGroupDto.icon,
                owner: mockUser._id,
                members: [mockUser._id],
                balances: {},
                expenses: [],
            };

            const findOneAndUpdateMock = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(expectedGroup),
            });
            model.findOneAndUpdate = findOneAndUpdateMock;

            const result = await service.upsertGroup(mockUser, upsertGroupDto);

            const expectedFilter = {
                name: upsertGroupDto.name,
                owner: mockUser._id,
            };

            const expectedUpdate = {
                ...upsertGroupDto,
                $setOnInsert: {
                    owner: mockUser._id,
                    members: [mockUser._id],
                    balances: {},
                },
            };

            const expectedOptions = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            };

            expect(findOneAndUpdateMock).toHaveBeenCalledWith(
                expectedFilter,
                expectedUpdate,
                expectedOptions,
            );
            expect(result).toEqual(expectedGroup);
        });

        it('should update an existing group if one with the same name and owner exists', async () => {
            const upsertGroupDto: UpsertGroupDto = {
                name: 'Existing Group',
                description: 'Updated description',
                icon: 'updated-icon-url',
            };

            const updatedGroup = {
                _id: new mongoose.Types.ObjectId(),
                name: upsertGroupDto.name,
                description: upsertGroupDto.description,
                icon: upsertGroupDto.icon,
                owner: mockUser._id,
                members: [mockUser._id],
                balances: {},
                expenses: [],
            };

            const findOneAndUpdateMock = jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(updatedGroup),
            });
            model.findOneAndUpdate = findOneAndUpdateMock;

            const result = await service.upsertGroup(mockUser, upsertGroupDto);

            const expectedFilter = {
                name: upsertGroupDto.name,
                owner: mockUser._id,
            };

            const expectedUpdate = {
                ...upsertGroupDto,
                $setOnInsert: {
                    owner: mockUser._id,
                    members: [mockUser._id],
                    balances: {},
                },
            };

            expect(findOneAndUpdateMock).toHaveBeenCalledWith(
                expectedFilter,
                expectedUpdate,
                expect.any(Object),
            );
            expect(result).toEqual(updatedGroup);
            expect(result.description).toBe('Updated description');
        });
    });
});