import { Link, useParams } from 'react-router-dom'
import { useGetPostsByUserIdQuery } from '../posts/postsSlice'
import { useGetUsersQuery } from './usersSlice'
import { DataGrid } from '@mui/x-data-grid';
import styled from '@emotion/styled';

const StyledList = styled('ul')`
list-style: none;
padding: 0;
`;
const UserPage = () => {
    const { userId } = useParams()
    console.log(userId, " userId")
    const { user,
        isLoading: isLoadingUser,
        isSuccess: isSuccessUser,
        isError: isErrorUser,
        error: errorUser
    } = useGetUsersQuery('getUsers', {
        selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
            user: data?.entities[userId],
            isLoading,
            isSuccess,
            isError,
            error
        }),
    })

    const {
        data: postsForUser,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsByUserIdQuery(userId);

    let content;
    let data
    if (isLoading || isLoadingUser) {
        content = <p>Loading...</p>
    } else if (isSuccess && isSuccessUser) {

        const { ids, entities } = postsForUser
        data = {
            columns: Object.keys(entities[ids[0]]).map((key) => ({
                field: key,
                headerName: key,
                width: 150,
            })),
            rows: Object.values(entities)
        }
        console.log(postsForUser, " postsForUser")
        content = (
            <section>
                {/* <h2>{user?.name}</h2>

                <DataGrid
                    data
                    pageSize={5}
                    rowsPerPageOptions={[5]}

                /> */}

                <StyledList>
                    {ids.map(id => (
                        <li key={id}>
                            <Link to={`/post/${entities[id]._id}`}>{entities[id].title}</Link>
                        </li>
                    ))}
                </StyledList>
            </section>
        )
    } else if (isError || isErrorUser) {
        content = <p>{error || errorUser}</p>;
    }

    return content
}

export default UserPage