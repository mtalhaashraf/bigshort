<script>
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import {
		Button,
		Column,
		Content,
		Grid,
		Header,
		HeaderUtilities,
		Row,
		SideNav,
		SideNavItems,
		SideNavLink,
		SkipToContent
	} from 'carbon-components-svelte';
	import Blog from 'carbon-icons-svelte/lib/Blog.svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	import Notification from 'carbon-icons-svelte/lib/Notification.svelte';
	import Report from 'carbon-icons-svelte/lib/Report.svelte';
	import User from 'carbon-icons-svelte/lib/User.svelte';
	import { equals } from 'ramda';
	import routes from '../../routes';
	const dispatch = createEventDispatcher();
	let isSideNavOpen = false;
</script>

<Header company="BIGSHORT" bind:isSideNavOpen>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<Button icon={Logout} on:click={() => dispatch('logout')}>Logout</Button>
	</HeaderUtilities>
</Header>

<SideNav bind:isOpen={isSideNavOpen} rail>
	<SideNavItems>
		<SideNavLink
			icon={User}
			text="Users"
			href={routes.users()}
			isSelected={equals($page.url.pathname, routes.users())}
		/>
		<SideNavLink
			icon={Blog}
			text="Blogs"
			href={routes.blogs()}
			isSelected={equals($page.url.pathname, routes.blogs())}
		/>
		<SideNavLink
			icon={Notification}
			text="Announcements"
			href={routes.announcements()}
			isSelected={equals($page.url.pathname, routes.announcements())}
		/>
		<SideNavLink
			icon={Report}
			text="Reports"
			href={routes.reports()}
			isSelected={equals($page.url.pathname, routes.reports())}
		/>
	</SideNavItems>
</SideNav>

<Content>
	<Grid>
		<Row>
			<Column>
				<slot />
			</Column>
		</Row>
	</Grid>
</Content>
